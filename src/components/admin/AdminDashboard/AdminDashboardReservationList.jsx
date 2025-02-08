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
        return <div className="reservation-list__empty">No hay reservas que mostrar</div>;
    }

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        // Asegurarnos de que tenemos un string válido de tiempo
        const timeParts = timeStr.split(':');
        if (timeParts.length >= 2) {
            return `${timeParts[0]}:${timeParts[1]}`;
        }
        return timeStr;
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
                        assignedTables.push(table.name);
                    }
                }
            });
        }
        
        // Si esta es la reserva seleccionada, añadir también las mesas seleccionadas temporalmente
        if (selectedReservation === reservationId && selectedTables.length > 0) {
            selectedTables.forEach(tableId => {
                const table = tables.find(t => t.id === tableId);
                if (table && !assignedTables.includes(table.name)) {
                    assignedTables.push(`${table.name} (pendiente)`);
                }
            });
        }
        
        return assignedTables;
    };

    return (
        <div className="reservation-list">
            {filteredReservations.map((reservation) => {
                const assignedTables = getAssignedTables(reservation.id);
                const statusClass = reservation.status ? reservation.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;
                const reservationData = shiftData.reservations[reservation.id] || reservation;
                const userName = reservationData.user?.name || `Usuario #${reservationData.user?.id}`;

                return (
                    <div 
                        key={reservation.id} 
                        className={`reservation-list__item reservation-list__item--${statusClass}${isSelected ? ' reservation-list__item--selected' : ''}`}
                        onClick={() => handleReservationSelect(reservation.id)}
                    >
                        <div className="reservation-list__content">
                            <div className="reservation-list__left">
                                <div className="reservation-list__main-info">
                                    <span className="reservation-list__time">{reservation.shift === 'lunch' ? '14:00' : '21:00'}</span>
                                    <span className="reservation-list__user">{userName}</span>
                                </div>
                                <div className="reservation-list__secondary-info">
                                    <span className="reservation-list__pax">{reservationData.guests} pax</span>
                                    <span className={`reservation-list__status reservation-list__status--${statusClass}`}>
                                        {reservationData.status}
                                    </span>
                                </div>
                            </div>
                            <div className="reservation-list__right">
                                <div className="reservation-list__tables">
                                    {assignedTables.map((table, index) => (
                                        <span key={index} className="reservation-list__table">{table}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
