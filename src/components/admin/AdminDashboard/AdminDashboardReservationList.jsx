import React, { useEffect } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardReservationList.css';

export default function AdminDashboardReservationList({ status = 'all', selectedDate, selectedShift }) {
    const { reservations, selectedReservation, setSelectedReservation, fetchReservations } = useDashboard();

    useEffect(() => {
        if (selectedDate && selectedShift) {
            fetchReservations(selectedDate, selectedShift);
        }
    }, [selectedDate, selectedShift, fetchReservations]);

    const handleReservationClick = (reservationId) => {
        setSelectedReservation(selectedReservation === reservationId ? null : reservationId);
    };

    const filteredReservations = status === 'all' 
        ? reservations 
        : reservations.filter(r => r.status === status);

    if (!filteredReservations.length) {
        return <div className="admin-dashboard-reservation-empty">No hay reservas que mostrar</div>;
    }

    return (
        <div className="admin-dashboard-reservation-list">
            {filteredReservations.map((reservation) => {
                const userName = reservation.user_info?.name || 'Sin nombre';
                const tablesList = Array.isArray(reservation.tables_ids) && reservation.tables_ids.length > 0
                    ? reservation.tables_ids.join(', ')
                    : 'sin asignar';
                const statusClass = reservation.status ? reservation.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;

                return (
                    <div 
                        key={reservation.id} 
                        className={`admin-dashboard-reservation-item status-${statusClass}${isSelected ? ' selected' : ''}`}
                        onClick={() => handleReservationClick(reservation.id)}
                    >
                        <div className="admin-dashboard-reservation-content">
                            <div className="admin-dashboard-reservation-left">
                                <span className="admin-dashboard-reservation-pax">{reservation.guests} pax</span>
                                <span className="admin-dashboard-reservation-name">{userName}</span>
                            </div>
                            <div className="admin-dashboard-reservation-right">
                                {tablesList}
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
