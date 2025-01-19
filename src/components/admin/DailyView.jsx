import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useRestaurantConfig } from '../../context/RestaurantConfigContext';
import './DailyView.css';

function DailyView() {
    const [defaultLayout, setDefaultLayout] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState('afternoon');
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const { token } = useAuth();
    const { config } = useRestaurantConfig();

    useEffect(() => {
        // Cargar el layout por defecto
        fetch('http://localhost:8000/api/map-layouts/default', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => setDefaultLayout(data))
        .catch(error => console.error('Error cargando el layout:', error));
    }, [token]);

    useEffect(() => {
        if (!config) return; // Esperar a tener la configuración

        // Cargar reservas del día seleccionado
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        console.log('Fetching reservations for date:', dateStr);
        
        fetch(`http://localhost:8000/api/reservations/date/${dateStr}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('Received reservations:', data);
            const filteredData = data.filter(r => {
                // Convertir la hora (14:30) a un número (14.5) para comparar
                const [hours, minutes] = r.time.split(':').map(Number);
                const timeAsNumber = hours + minutes/60;
                
                // Usar los horarios de la configuración
                const [openHours, openMinutes] = (config.openingHours?.[selectedShift]?.open || '').split(':').map(Number);
                const [closeHours, closeMinutes] = (config.openingHours?.[selectedShift]?.close || '').split(':').map(Number);
                const openTime = openHours + openMinutes/60;
                const closeTime = closeHours + closeMinutes/60;

                const isInShift = timeAsNumber >= openTime && timeAsNumber <= closeTime;

                console.log('Time:', r.time, 
                          'Shift:', selectedShift,
                          'Opening hours:', config.openingHours?.[selectedShift]?.open, '-', config.openingHours?.[selectedShift]?.close,
                          'Is in shift?:', isInShift);

                return isInShift;
            });
            console.log('Filtered reservations:', filteredData);
            setReservations(filteredData);
        })
        .catch(error => console.error('Error cargando reservas:', error));
    }, [selectedDate, selectedShift, token, config]); // Añadido config a las dependencias

    const toggleTable = async (reservationId, tableId) => {
        const reservation = reservations.find(r => r.id === reservationId);
        if (!reservation) return;

        const newTablesIds = reservation.tables_ids?.includes(tableId)
            ? reservation.tables_ids.filter(id => id !== tableId)
            : [...(reservation.tables_ids || []), tableId];

        try {
            const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: reservation.user_id,
                    datetime: reservation.datetime,
                    guests: reservation.guests,
                    status: reservation.status,
                    tables_ids: newTablesIds
                })
            });

            if (!response.ok) throw new Error('Error al actualizar la reserva');

            // Actualizar estado local
            setReservations(prevReservations => 
                prevReservations.map(r => 
                    r.id === reservationId 
                        ? { ...r, tables_ids: newTablesIds }
                        : r
                )
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderReservation = (reservation) => (
        <div 
            key={reservation.id} 
            className={`reservation-item ${selectedReservation?.id === reservation.id ? 'selected' : ''}`}
            onClick={() => setSelectedReservation(
                selectedReservation?.id === reservation.id ? null : reservation
            )}
        >
            <div className="reservation-info">
                <span className="reservation-time">{reservation.time}</span>
                <span className="reservation-name">
                    {reservation.user_info?.name || 'Cliente sin nombre'}
                </span>
                <span className="reservation-guests">{reservation.guests} personas</span>
            </div>
            <div className="reservation-table">
                {reservation.tables_ids?.length > 0 ? (
                    <span>Mesas: {reservation.tables_ids.join(', ')}</span>
                ) : (
                    <span className="no-table">Sin mesas asignadas</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="daily-view">
            <div className="daily-controls">
                <input 
                    type="date" 
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={e => setSelectedDate(new Date(e.target.value))}
                />
                <select 
                    value={selectedShift}
                    onChange={e => setSelectedShift(e.target.value)}
                >
                    <option value="afternoon">Comida ({config?.openingHours?.afternoon?.open} - {config?.openingHours?.afternoon?.close})</option>
                    <option value="evening">Cena ({config?.openingHours?.evening?.open} - {config?.openingHours?.evening?.close})</option>
                </select>
            </div>

            <div className="daily-panels">
                {/* Panel de reservas */}
                <div className="reservations-list">
                    <h3>Reservas del día</h3>
                    <div className="reservations">
                        {reservations.map(reservation => renderReservation(reservation))}
                    </div>
                </div>

                {/* Panel del mapa */}
                <div className="map-panel">
                    <h3>Distribución de mesas</h3>
                    {defaultLayout && (
                        <div className="layout-map-container">
                            <svg 
                                width="100%" 
                                height="100%" 
                                viewBox={(() => {
                                    // Encontrar los límites del contenido
                                    const minX = Math.min(...defaultLayout.layout.map(e => e.x1));
                                    const minY = Math.min(...defaultLayout.layout.map(e => e.y1));
                                    const maxX = Math.max(...defaultLayout.layout.map(e => e.x2));
                                    const maxY = Math.max(...defaultLayout.layout.map(e => e.y2));
                                    
                                    // Calcular dimensiones
                                    const width = maxX - minX;
                                    const height = maxY - minY;
                                    
                                    // Añadir un pequeño margen
                                    return `${minX - width*0.05} ${minY - height*0.05} ${maxX + width*0.05} ${maxY + height*0.05}`;
                                })()} 
                                className="layout-map"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                {defaultLayout.layout.map((element, index) => {
                                    if (element.type === 'table') {
                                        const isAssigned = selectedReservation?.tables_ids?.includes(element.tableId);
                                        return (
                                            <g 
                                                key={element.id}
                                                transform={`rotate(${element.rotation || 0} ${(element.x1 + element.x2) / 2} ${(element.y1 + element.y2) / 2})`}
                                                onClick={() => {
                                                    if (selectedReservation) {
                                                        toggleTable(selectedReservation.id, element.tableId);
                                                    }
                                                }}
                                                style={{ cursor: selectedReservation ? 'pointer' : 'default' }}
                                            >
                                                <rect
                                                    x={element.x1}
                                                    y={element.y1}
                                                    width={element.x2 - element.x1}
                                                    height={element.y2 - element.y1}
                                                    className={`table ${isAssigned ? 'selected' : ''} ${
                                                        reservations.some(r => r.tables_ids?.includes(element.tableId)) ? 'occupied' : ''
                                                    }`}
                                                />
                                                <text
                                                    x={(element.x1 + element.x2) / 2}
                                                    y={(element.y1 + element.y2) / 2}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    className="table-label"
                                                >
                                                    {element.tableName || element.tableId}
                                                </text>
                                            </g>
                                        );
                                    } else {
                                        return (
                                            <line
                                                key={element.id}
                                                x1={element.x1}
                                                y1={element.y1}
                                                x2={element.x2}
                                                y2={element.y2}
                                                className="wall"
                                            />
                                        );
                                    }
                                })}
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DailyView;
