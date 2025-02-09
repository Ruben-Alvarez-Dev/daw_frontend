import React, { useState } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import { IoWarning, IoCheckmarkCircle } from "react-icons/io5";
import './AdminDashboardReservationList.css';

export default function AdminDashboardReservationList({ status = 'all' }) {
    const [openStatusMenu, setOpenStatusMenu] = useState(null);
    const { 
        reservations, 
        shiftData,
        selectedReservation,
        handleReservationSelect,
        selectedDate,
        selectedShift,
        updateReservationStatus,
        hoveredReservation,
        selectedTables,
        assignTables
    } = useDashboard();

    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5); // Mostrar solo HH:mm
    };

    const statusOptions = ['pending', 'confirmed', 'cancelled', 'seated', 'no-show'];

    // Obtener las reservas del día y turno seleccionados
    const currentReservations = selectedDate && selectedShift && reservations[selectedDate]?.[selectedShift] || [];
    
    const filteredReservations = status === 'all' 
        ? currentReservations 
        : currentReservations.filter(r => r.status === status);

    if (!filteredReservations.length) {
        return <div className="reservation-list__empty">No hay reservas que mostrar</div>;
    }

    const getAssignedTables = (reservationId) => {
        const assignedTables = [];
        
        // Primero añadir las mesas ya asignadas
        if (shiftData?.distribution) {
            Object.entries(shiftData.distribution).forEach(([tableKey, resId]) => {
                if (parseInt(resId) === parseInt(reservationId)) {
                    const tableId = tableKey.replace('table_', '');
                    const table = Object.values(shiftData.tables).find(t => t.id === parseInt(tableId));
                    if (table) {
                        assignedTables.push(table.name);
                    }
                }
            });
        }
        
        // Si esta es la reserva seleccionada, añadir también las mesas seleccionadas temporalmente
        if (selectedReservation === reservationId && selectedTables.length > 0) {
            selectedTables.forEach(tableId => {
                const table = Object.values(shiftData.tables).find(t => t.id === tableId);
                if (table && !assignedTables.includes(table.name)) {
                    assignedTables.push(table.name);
                }
            });
        }
        
        return assignedTables;
    };

    const handleStatusClick = (e, reservationId) => {
        e.stopPropagation();
        setOpenStatusMenu(openStatusMenu === reservationId ? null : reservationId);
    };

    const handleMouseLeave = () => {
        setOpenStatusMenu(null);
    };

    const handleStatusChange = async (e, reservationId, newStatus) => {
        e.stopPropagation();
        await updateReservationStatus(reservationId, newStatus);
        setOpenStatusMenu(null);
    };

    return (
        <div className="reservation-list">
            {filteredReservations.map((reservation) => {
                const assignedTables = getAssignedTables(reservation.id);
                const statusClass = reservation.status ? reservation.status.toLowerCase() : '';
                const isSelected = selectedReservation === reservation.id;
                const isHighlighted = hoveredReservation && parseInt(hoveredReservation) === parseInt(reservation.id);

                return (
                    <div 
                        key={reservation.id} 
                        className={`reservation-list__item reservation-list__item--${statusClass}${isSelected ? ' reservation-list__item--selected' : ''}${isHighlighted ? ' reservation-list__item--highlighted' : ''}`}
                        onClick={() => handleReservationSelect(reservation.id)}
                    >
                        <div className="reservation-list__time">
                            {formatTime(reservation.time)}
                        </div>
                        <div className="reservation-list__info">
                            <div className="reservation-list__guests">
                                {reservation.guests} pax
                            </div>
                            {assignedTables.length > 0 && (
                                <div className="reservation-list__tables">
                                    {assignedTables.join(', ')}
                                </div>
                            )}
                        </div>
                        <div 
                            className="reservation-list__status"
                            onClick={(e) => handleStatusClick(e, reservation.id)}
                        >
                            <span className={`status-badge status-badge--${statusClass}`}>
                                {reservation.status}
                            </span>
                            {openStatusMenu === reservation.id && (
                                <div 
                                    className="status-menu"
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {statusOptions.map((status) => (
                                        <div
                                            key={status}
                                            className="status-menu__item"
                                            onClick={(e) => handleStatusChange(e, reservation.id, status)}
                                        >
                                            {status}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {isSelected && selectedTables.length > 0 && (
                            <button 
                                className="reservation-list__assign-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    assignTables();
                                }}
                            >
                                <IoCheckmarkCircle />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
