import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardReservationList.css';

export default function AdminDashboardReservationList({ status = 'all' }) {
    const { reservations, selectedReservation, setSelectedReservation, users } = useDashboard();

    const handleReservationClick = (reservationId) => {
        setSelectedReservation(selectedReservation === reservationId ? null : reservationId);
    };

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

    return (
        <div className="admin-dashboard-reservation-list">
            {filteredReservations.map((reservation) => {
                const tablesList = Array.isArray(reservation.tables_ids) && reservation.tables_ids.length > 0
                    ? reservation.tables_ids.join(', ')
                    : 'sin asignar';
                const statusClass = reservation.status ? reservation.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;
                const userName = users[reservation.user_id]?.name || `Usuario #${reservation.user_id}`;

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
                                <div className="admin-dashboard-reservation-info">
                                    <span className="admin-dashboard-reservation-name">{userName}</span>
                                    <span className="admin-dashboard-reservation-date">
                                        {formatTime(reservation.time)} - {getShiftLabel(reservation.shift)}
                                    </span>
                                </div>
                            </div>
                            <div className="admin-dashboard-reservation-right">
                                <span className="admin-dashboard-reservation-tables">Mesas: {tablesList}</span>
                            </div>
                        </div>
                        <div className={`admin-dashboard-reservation-status-container status-${statusClass}`}>
                            {reservation.status}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
