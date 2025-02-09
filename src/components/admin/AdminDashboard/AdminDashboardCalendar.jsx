import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import dayjs from 'dayjs';
import './AdminDashboardCalendar.css';

export default function AdminDashboardCalendar() {
    const { shiftData, selectedDate, setSelectedDate, setSelectedShift, loadMonthReservations, reservations } = useDashboard();
    const [currentMonth, setCurrentMonth] = useState(() => dayjs().format('YYYY-MM'));

    // Calcular la capacidad total una sola vez cuando cambian las mesas
    const totalCapacity = useMemo(() => {
        return Object.values(shiftData.tables)
            .reduce((sum, table) => sum + table.capacity, 0);
    }, [shiftData.tables]);

    // Preparar un mapa de reservas por día/turno para acceso rápido
    const reservationsMap = useMemo(() => {
        const map = {};
        // Usar las reservas del mes
        Object.entries(reservations).forEach(([date, shifts]) => {
            map[date] = shifts;
        });
        return map;
    }, [reservations]);

    const calculateAvailability = useCallback((date, shift) => {
        const dayReservations = reservationsMap[date]?.[shift] || [];
        const reservedSeats = dayReservations.reduce((sum, res) => sum + res.guests, 0);
        return {
            available: totalCapacity - reservedSeats,
            total: totalCapacity
        };
    }, [reservationsMap, totalCapacity]);

    const getCapacityColor = useCallback((seats, total) => {
        if (seats <= 0) return 'full';
        if (seats === total) return 'high';
        if (seats < total * 0.25) return 'low';
        return 'medium';
    }, []);

    const isDayFull = useCallback((date) => {
        const lunch = calculateAvailability(date, 'lunch');
        const dinner = calculateAvailability(date, 'dinner');
        return lunch.available <= 0 && dinner.available <= 0;
    }, [calculateAvailability]);

    // Cargar datos cuando cambia el mes
    useEffect(() => {
        const startDate = dayjs(currentMonth).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs(currentMonth).endOf('month').format('YYYY-MM-DD');
        loadMonthReservations(startDate, endDate);
    }, [currentMonth, loadMonthReservations]);

    const handlePrevMonth = () => {
        setCurrentMonth(prev => dayjs(prev).subtract(1, 'month').format('YYYY-MM'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => dayjs(prev).add(1, 'month').format('YYYY-MM'));
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setSelectedShift('lunch');
    };

    const renderCapacityIndicator = (seats, total) => {
        const status = getCapacityColor(seats, total);
        if (status === 'full') {
            return <div className="calendar__capacity-x">✕</div>;
        }
        return (
            <div className={`calendar__capacity-circle calendar__capacity-circle--${status}`}>
                {seats}
            </div>
        );
    };

    const renderDayContent = (date, dateStr) => {
        const lunch = calculateAvailability(dateStr, 'lunch');
        const dinner = calculateAvailability(dateStr, 'dinner');
        
        if (isDayFull(dateStr)) {
            return (
                <div className="calendar__day-content">
                    <div className="calendar__day-number">{date}</div>
                </div>
            );
        }

        return (
            <div className="calendar__day-content">
                <div className="calendar__day-number">{date}</div>
                <div className="calendar__capacity">
                    {renderCapacityIndicator(lunch.available, lunch.total)}
                    {renderCapacityIndicator(dinner.available, dinner.total)}
                </div>
            </div>
        );
    };

    const renderCalendar = () => {
        const firstDay = dayjs(currentMonth).startOf('month');
        const daysInMonth = firstDay.daysInMonth();
        const startWeekday = firstDay.day();
        const weeks = [];
        let days = [];

        // Días vacíos antes del primer día del mes
        for (let i = 0; i < startWeekday; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = dayjs(currentMonth).date(day).format('YYYY-MM-DD');
            const isSelected = dateStr === selectedDate;
            const isFull = isDayFull(dateStr);

            days.push(
                <td 
                    key={day}
                    onClick={() => handleDayClick(dateStr)}
                    className={`${isFull ? 'calendar__day--full' : ''} ${isSelected ? 'calendar__day--selected' : ''}`}
                >
                    {renderDayContent(day, dateStr)}
                </td>
            );

            if ((startWeekday + day) % 7 === 0 || day === daysInMonth) {
                weeks.push(<tr key={day}>{days}</tr>);
                days = [];
            }
        }

        // Rellenar la última semana si es necesario
        while (days.length > 0 && days.length < 7) {
            days.push(<td key={`empty-end-${days.length}`}></td>);
        }
        if (days.length > 0) {
            weeks.push(<tr key="last">{days}</tr>);
        }

        return weeks;
    };

    return (
        <div className="calendar">
            <div className="calendar__nav">
                <button className="calendar__nav-button" onClick={handlePrevMonth}>
                    &lt;
                </button>
                <span className="calendar__month">
                    {dayjs(currentMonth).format('MMMM [De] YYYY')}
                </span>
                <button className="calendar__nav-button" onClick={handleNextMonth}>
                    &gt;
                </button>
            </div>
            <div className="calendar__table-container">
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
                        {renderCalendar()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
