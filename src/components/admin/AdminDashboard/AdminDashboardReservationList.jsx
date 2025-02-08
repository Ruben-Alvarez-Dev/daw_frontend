import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardReservationList.css';

export default function AdminDashboardReservationList({ status = 'all' }) {
    const { 
        reservations, 
        selectedReservation, 
        shiftData,
        tables,
        handleReservationSelect,
        selectedTables,
        assignSelectedTables,
        selectedDate,
        selectedShift
    } = useDashboard();

    const filteredReservations = status === 'all' 
        ? reservations 
        : reservations.filter(r => r.status === status);

    if (!filteredReservations.length) {
        return <div className="admin-dashboard-reservation-empty">No hay reservas que mostrar</div>;
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5); // Solo toma HH:MM
    };

    const getShiftLabel = (shift) => {
        return shift === 'lunch' ? 'Comida' : shift === 'dinner' ? 'Cena' : shift;
    };

    const getAssignedTables = (reservationId) => {
        const assignedTables = [];
        
        // Primero añadir las mesas ya asignadas
        if (shiftData?.distribution) {
            Object.entries(shiftData.distribution).forEach(([tableKey, resId]) => {
                if (resId === reservationId) {
                    const tableId = tableKey.replace('table_', '');
                    const table = tables.find(t => t.id === parseInt(tableId));
                    if (table) {
                        assignedTables.push(`Mesa ${table.name}`);
                    }
                }
            });
        }
        
        // Si esta es la reserva seleccionada, añadir también las mesas seleccionadas temporalmente
        if (selectedReservation === reservationId && selectedTables.length > 0) {
            selectedTables.forEach(tableId => {
                const table = tables.find(t => t.id === tableId);
                if (table && !assignedTables.includes(`Mesa ${table.name}`)) {
                    assignedTables.push(`Mesa ${table.name} (pendiente)`);
                }
            });
        }
        
        return assignedTables;
    };

    const handleReservationClick = async (reservationId) => {
        // Si hay mesas seleccionadas y vamos a deseleccionar la reserva actual
        if (selectedReservation === reservationId && selectedTables.length > 0) {
            const success = await assignSelectedTables(selectedDate, selectedShift);
            if (!success) return; // Si la asignación falla, no deseleccionamos la reserva
        }
        // Proceder con la selección/deselección de la reserva
        handleReservationSelect(reservationId);
    };

    return (
        <div className="admin-dashboard-reservation-list">
            {filteredReservations.map((reservation) => {
                const assignedTables = getAssignedTables(reservation.id);
                const tablesList = assignedTables.length > 0 
                    ? assignedTables.join(', ') 
                    : 'sin asignar';
                    
                const statusClass = reservation.status ? reservation.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;
                const userName = reservation.user?.name || `Usuario #${reservation.user?.id}`;

                return (
                    <div 
                        key={reservation.id} 
                        className={`admin-dashboard-reservation-item status-${statusClass}${isSelected ? ' selected' : ''}`}
                        onClick={() => handleReservationClick(reservation.id)}
                    >
                        <div className="admin-dashboard-reservation-content">
                            <div className="admin-dashboard-reservation-left">
                                <div className="admin-dashboard-reservation-header">
                                    <span className="admin-dashboard-reservation-id">#{reservation.id}</span>
                                    <span className="admin-dashboard-reservation-pax">{reservation.guests} pax</span>
                                </div>
                                <div className="admin-dashboard-reservation-user">{userName}</div>
                                <div className="admin-dashboard-reservation-time">
                                    {formatTime(reservation.time)} - {getShiftLabel(reservation.shift)}
                                </div>
                            </div>
                            <div className="admin-dashboard-reservation-right">
                                <div className="admin-dashboard-reservation-tables">
                                    Mesas: {tablesList}
                                </div>
                                <div className={`admin-dashboard-reservation-status status-${statusClass}`}>
                                    {reservation.status}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
