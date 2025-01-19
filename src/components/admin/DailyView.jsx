import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function DailyView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState('lunch');
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        // Cargar reservas del día seleccionado
        fetch(`/api/bookings?date=${format(selectedDate, 'yyyy-MM-dd')}&shift=${selectedShift}`)
            .then(res => res.json())
            .then(data => setReservations(data));
    }, [selectedDate, selectedShift]);

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
                    <option value="lunch">Comida</option>
                    <option value="dinner">Cena</option>
                </select>
            </div>

            <div className="daily-panels">
                {/* Panel de reservas */}
                <div className="reservations-list">
                    <h3>Reservas del día</h3>
                    <div className="reservations">
                        {reservations.map(reservation => (
                            <div key={reservation.id} className="reservation-item">
                                <span>{reservation.time}</span>
                                <span>{reservation.customer_name}</span>
                                <span>{reservation.guests} personas</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel del mapa */}
                <div className="map-panel">
                    <h3>Distribución de mesas</h3>
                    {/* Aquí insertaremos una versión simplificada del mapa */}
                </div>
            </div>
        </div>
    );
}

export default DailyView;
