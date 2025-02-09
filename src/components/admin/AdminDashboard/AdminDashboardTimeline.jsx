import React, { useState, useRef } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import { IoContract } from 'react-icons/io5';
import './AdminDashboardTimeline.css';

export default function AdminDashboardTimeline() {
    const { 
        selectedDate,
        selectedShift,
        tables,
        reservations,
        shiftData
    } = useDashboard();

    const [scale, setScale] = useState(1);
    const timelineRef = useRef(null);

    const timeSlots = Array.from({ length: 13 }, (_, i) => `${12 + i}:00`);

    const getReservationStyle = (reservation) => {
        const time = reservation.time;
        const hour = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);
        const startPosition = (hour - 12) * 60 + minutes;
        const width = reservation.duration || 90; // Default duration 90 minutes

        return {
            left: `${startPosition * scale}px`,
            width: `${width * scale}px`
        };
    };

    const handleFitToScreen = () => {
        if (!timelineRef.current) return;
        
        const timelineWidth = timelineRef.current.offsetWidth;
        const totalMinutes = 13 * 60; // 13 hours in minutes
        const newScale = timelineWidth / totalMinutes;
        setScale(newScale);
    };

    return (
        <div className="timeline">
            <div className="timeline__header">
                <button 
                    className="timeline__fit-button"
                    onClick={handleFitToScreen}
                >
                    <IoContract /> Fit to Screen
                </button>
            </div>
            
            <div className="timeline__content" ref={timelineRef}>
                <div className="timeline__time-header">
                    {timeSlots.map(time => (
                        <div key={time} className="timeline__time-slot" style={{ width: `${60 * scale}px` }}>
                            {time}
                        </div>
                    ))}
                </div>
                
                <div className="timeline__tables">
                    {tables.map(table => {
                        const tableReservations = reservations.filter(r => 
                            r.date === selectedDate && 
                            r.shift === selectedShift &&
                            shiftData?.distribution?.[`table_${table.id}`] === r.id
                        );

                        return (
                            <div key={table.id} className="timeline__table-row">
                                <div className="timeline__table-name">
                                    {table.name}
                                </div>
                                <div className="timeline__table-content">
                                    {tableReservations.map(reservation => (
                                        <div
                                            key={reservation.id}
                                            className={`timeline__reservation timeline__reservation--${reservation.status}`}
                                            style={getReservationStyle(reservation)}
                                        >
                                            <div className="timeline__reservation-time">
                                                {reservation.time} - {reservation.guests} pax
                                            </div>
                                            <div className="timeline__reservation-name">
                                                {reservation.user?.name || `Usuario #${reservation.user?.id}`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
