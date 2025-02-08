import React, { useState } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import { IoWarning } from "react-icons/io5";
import './AdminDashboardReservationList.css';

export default function AdminDashboardReservationList({ status = 'all' }) {
    const [openStatusMenu, setOpenStatusMenu] = useState(null);
    const { 
        reservations, 
        selectedReservation, 
        shiftData,
        tables,
        handleReservationSelect,
        selectedTables,
        assignSelectedTables,
        selectedDate,
        selectedShift,
        updateReservationStatus
    } = useDashboard();

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5); // Mostrar solo HH:mm
    };

    const statusOptions = ['pending', 'confirmed', 'cancelled', 'seated', 'no-show'];

    const filteredReservations = status === 'all' 
        ? reservations 
        : reservations.filter(r => r.status === status);

    if (!filteredReservations.length) {
        return <div className="reservation-list__empty">No hay reservas que mostrar</div>;
    }

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
                    assignedTables.push(table.name);
                }
            });
        }
        
        return assignedTables;
    };

    const handleStatusClick = (e, reservationId) => {
        e.stopPropagation(); // Evitar que se seleccione la reserva
        if (openStatusMenu === reservationId) {
            setOpenStatusMenu(null);
        } else {
            setOpenStatusMenu(reservationId);
        }
    };

    const handleMouseLeave = () => {
        setOpenStatusMenu(null);
    };

    const handleStatusChange = async (e, reservationId, newStatus) => {
        e.stopPropagation(); // Evitar que se seleccione la reserva
        await updateReservationStatus(reservationId, newStatus);
        setOpenStatusMenu(null); // Cerrar el menú
    };

    return (
        <div className="reservation-list">
            {filteredReservations.map((reservation) => {
                const assignedTables = getAssignedTables(reservation.id);
                const reservationData = shiftData.reservations[reservation.id] || reservation;
                console.log('Reservation data:', reservationData);
                console.log('Original time:', reservationData.time);
                const statusClass = reservationData.status ? reservationData.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;
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
                                    <span className="reservation-list__time">{formatTime(reservation.time)}</span>
                                    <span className="reservation-list__user">{userName}</span>
                                </div>
                                <div className="reservation-list__secondary-info">
                                    <span className="reservation-list__pax">{reservationData.guests} pax</span>
                                    <div 
                                        className="reservation-list__status-container"
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <span 
                                            className={`reservation-list__status reservation-list__status--${statusClass}`}
                                            onClick={(e) => handleStatusClick(e, reservation.id)}
                                        >
                                            {reservationData.status}
                                        </span>
                                        {openStatusMenu === reservation.id && (
                                            <div className="reservation-list__status-menu">
                                                {statusOptions.map(option => (
                                                    <div
                                                        key={option}
                                                        className={`reservation-list__status-option reservation-list__status--${option}`}
                                                        onClick={(e) => handleStatusChange(e, reservation.id, option)}
                                                    >
                                                        {option}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
                        <div className="reservation-list__warning">
                            <IoWarning />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
