import React, { useState, useEffect } from 'react';
import { useConfiguration } from '../../context/ConfigurationContext';
import { SHIFTS, getShiftTypes } from '../../constants/shifts';
import './ReservationDateTime.css';

export default function ReservationDateTime({ onDateTimeChange, initialDate, initialTime, initialShift, disabled }) {
    const { config, loading, error } = useConfiguration();
    const [selectedDate, setSelectedDate] = useState(initialDate || '');
    const [selectedShift, setSelectedShift] = useState(initialShift || '');
    const [selectedTime, setSelectedTime] = useState(initialTime || '');
    const [availableTimes, setAvailableTimes] = useState([]);

    // Debug logs
    useEffect(() => {
        console.log('ReservationDateTime - Config:', config);
        console.log('ReservationDateTime - Loading:', loading);
        console.log('ReservationDateTime - Error:', error);
    }, [config, loading, error]);

    useEffect(() => {
        if (config?.openingHours) {
            console.log('Calculating times');
            const times = [];
            const interval = config.timeInterval || 15;

            const addMinutes = (time, minutes) => {
                const [hours, mins] = time.split(':').map(Number);
                const totalMinutes = hours * 60 + mins + minutes;
                const newHours = Math.floor(totalMinutes / 60);
                const newMinutes = totalMinutes % 60;
                return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
            };

            // Generate lunch times
            if (config.openingHours[SHIFTS.LUNCH]?.open && config.openingHours[SHIFTS.LUNCH]?.close && (!selectedShift || selectedShift === SHIFTS.LUNCH)) {
                let currentTime = config.openingHours[SHIFTS.LUNCH].open;
                const lunchClose = config.openingHours[SHIFTS.LUNCH].close;

                while (currentTime <= lunchClose) {
                    times.push(currentTime);
                    currentTime = addMinutes(currentTime, interval);
                }
            }

            // Generate dinner times
            if (config.openingHours[SHIFTS.DINNER]?.open && config.openingHours[SHIFTS.DINNER]?.close && (!selectedShift || selectedShift === SHIFTS.DINNER)) {
                let currentTime = config.openingHours[SHIFTS.DINNER].open;
                const dinnerClose = config.openingHours[SHIFTS.DINNER].close;

                while (currentTime <= dinnerClose) {
                    times.push(currentTime);
                    currentTime = addMinutes(currentTime, interval);
                }
            }

            console.log('Available times:', times);
            setAvailableTimes(times);
        } else {
            console.log('Cannot calculate times:', {
                hasConfig: !!config,
                hasOpeningHours: !!(config?.openingHours)
            });
            setAvailableTimes([]);
        }
    }, [selectedShift, config]);

    useEffect(() => {
        onDateTimeChange({
            date: selectedDate || '',
            shift: selectedShift || '',
            time: selectedTime || ''
        });
    }, [selectedDate, selectedShift, selectedTime]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setSelectedTime(''); // Reset time when date changes
    };

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
        setSelectedTime(''); // Reset time when shift changes
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const getShiftLabel = (shift) => {
        return shift === SHIFTS.LUNCH ? 'Comida' : 'Cena';
    };

    if (loading) {
        return <div>Cargando configuración...</div>;
    }

    if (error) {
        return <div>Error al cargar la configuración: {error}</div>;
    }

    return (
        <div className="reservation-datetime">
            <div className="reservation-datetime-field">
                <label>Fecha</label>
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={disabled}
                />
            </div>

            <div className="reservation-datetime-field">
                <label>Turno</label>
                <select 
                    value={selectedShift} 
                    onChange={handleShiftChange}
                    disabled={disabled}
                >
                    <option value="">Seleccionar turno</option>
                    {getShiftTypes().map(shift => (
                        <option key={shift} value={shift}>
                            {getShiftLabel(shift)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="reservation-datetime-field">
                <label>Hora</label>
                <select 
                    value={selectedTime} 
                    onChange={handleTimeChange}
                    disabled={!selectedShift || !selectedDate || disabled}
                >
                    <option value="">Seleccionar hora</option>
                    {availableTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
