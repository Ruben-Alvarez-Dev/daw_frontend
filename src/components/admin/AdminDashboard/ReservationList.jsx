import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './ReservationList.css';

export default function ReservationList() {
    const { reservations, selectedReservation, handleReservationSelect } = useDashboard();

    if (!reservations.length) {
        return (
            <div className="no-reservations">
                No hay reservas que mostrar
            </div>
        );
    }

    return (
        <div className="reservations-list">
            {reservations.map(reservation => (
                <div
                    key={reservation.id}
                    className={`reservation-item ${selectedReservation === reservation.id ? 'selected' : ''}`}
                    onClick={() => handleReservationSelect(reservation.id)}
                >
                    <div className="reservation-header">
                        <span className="reservation-id">#{reservation.id}</span>
                        <span className="reservation-time">{reservation.time}</span>
                    </div>
                    <div className="reservation-details">
                        <div className="reservation-guests">{reservation.guests} pax</div>
                        <div className="reservation-status">{reservation.status}</div>
                    </div>
                    {reservation.tables?.length > 0 && (
                        <div className="reservation-tables">
                            Mesas: {reservation.tables.map(t => t.number).join(', ')}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
