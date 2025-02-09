import React, { useState } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardCalendar.css';

export default function AdminDashboardCalendar() {
    const { 
        selectedDate,
        setSelectedDate,
        setSelectedShift,
        reservations,
        tables
    } = useDashboard();

    const [currentMonth, setCurrentMonth] = useState(() => {
        const date = new Date(selectedDate);
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });

    const totalCapacity = tables.reduce((acc, table) => acc + table.capacity, 0);

    const getCapacityStatus = (available, total) => {
        const percentage = (available / total) * 100;
        if (percentage > 50) return 'high';
        if (percentage > 25) return 'medium';
        return 'low';
    };

    const getAvailableSeats = (date, shift) => {
        const shiftReservations = reservations.filter(r => 
            r.date === date && 
            r.shift === shift && 
            r.status !== 'cancelled'
        );
        const occupiedSeats = shiftReservations.reduce((acc, r) => acc + r.guests, 0);
        return totalCapacity - occupiedSeats;
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setSelectedShift('lunch');
    };

    const changeMonth = (delta) => {
        setCurrentMonth(prevMonth => {
            const newMonth = new Date(prevMonth);
            newMonth.setMonth(newMonth.getMonth() + delta);
            return newMonth;
        });
    };

    const formatMonth = (date) => {
        return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
            .replace(/^\w/, c => c.toUpperCase());
    };

    const renderCalendarDays = () => {
        const days = [];
        const firstDay = new Date(currentMonth);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        // Ajustar para que la semana empiece en lunes
        let startDay = firstDay.getDay();
        if (startDay === 0) startDay = 7;
        startDay -= 1;

        // Añadir celdas vacías para los días antes del primer día del mes
        for (let i = 0; i < startDay; i++) {
            days.push(<td key={`empty-start-${i}`} />);
        }

        // Añadir los días del mes
        for (let date = 1; date <= lastDay.getDate(); date++) {
            const currentDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), date);
            const dateStr = currentDate.toISOString().split('T')[0];
            const lunchSeats = getAvailableSeats(dateStr, 'lunch');
            const dinnerSeats = getAvailableSeats(dateStr, 'dinner');
            
            const lunchStatus = getCapacityStatus(lunchSeats, totalCapacity);
            const dinnerStatus = getCapacityStatus(dinnerSeats, totalCapacity);
            
            days.push(
                <td 
                    key={date} 
                    onClick={() => handleDayClick(dateStr)}
                >
                    <div className="calendar__day-content">
                        <div className="calendar__day-number">{date}</div>
                        <div className="calendar__capacity">
                            <div className={`calendar__capacity-circle calendar__capacity-circle--${lunchStatus}`}>
                                {lunchSeats}
                            </div>
                            <div className={`calendar__capacity-circle calendar__capacity-circle--${dinnerStatus}`}>
                                {dinnerSeats}
                            </div>
                        </div>
                    </div>
                </td>
            );
        }

        // Añadir celdas vacías al final si es necesario
        const totalDays = days.length;
        const remainingCells = 7 - (totalDays % 7);
        if (remainingCells < 7) {
            for (let i = 0; i < remainingCells; i++) {
                days.push(<td key={`empty-end-${i}`} />);
            }
        }

        // Organizar los días en filas
        const rows = [];
        let cells = [];
        
        days.forEach((day, i) => {
            cells.push(day);
            if ((i + 1) % 7 === 0) {
                rows.push(<tr key={i}>{cells}</tr>);
                cells = [];
            }
        });
        
        if (cells.length > 0) {
            rows.push(<tr key={days.length}>{cells}</tr>);
        }

        return rows;
    };

    return (
        <div className="calendar">
            <div className="calendar__nav">
                <div className="calendar__nav-buttons">
                    <button 
                        className="calendar__nav-button"
                        onClick={() => changeMonth(-1)}
                    >
                        Anterior
                    </button>
                    <button 
                        className="calendar__nav-button"
                        onClick={() => changeMonth(1)}
                    >
                        Siguiente
                    </button>
                </div>
                <div className="calendar__month">
                    {formatMonth(currentMonth)}
                </div>
            </div>
            <table className="calendar__table">
                <thead>
                    <tr>
                        <th>Lun</th>
                        <th>Mar</th>
                        <th>Mie</th>
                        <th>Jue</th>
                        <th>Vie</th>
                        <th>Sab</th>
                        <th>Dom</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCalendarDays()}
                </tbody>
            </table>
        </div>
    );
}
