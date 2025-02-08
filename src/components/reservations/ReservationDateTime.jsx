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
        if (selectedTime && config?.openingHours) {
            // Determinar el turno basado en la hora seleccionada
            const [hours] = selectedTime.split(':').map(Number);
            const lunchOpen = parseInt(config.openingHours[SHIFTS.LUNCH]?.open?.split(':')[0]) || 13;
            const lunchClose = parseInt(config.openingHours[SHIFTS.LUNCH]?.close?.split(':')[0]) || 16;
            const dinnerOpen = parseInt(config.openingHours[SHIFTS.DINNER]?.open?.split(':')[0]) || 20;
            const dinnerClose = parseInt(config.openingHours[SHIFTS.DINNER]?.close?.split(':')[0]) || 23;

            // Actualizar el turno automáticamente según la hora
            if (hours >= lunchOpen && hours <= lunchClose) {
                setSelectedShift(SHIFTS.LUNCH);
            } else if (hours >= dinnerOpen && hours <= dinnerClose) {
                setSelectedShift(SHIFTS.DINNER);
            }
        }
    }, [selectedTime, config]);

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
        const newTime = e.target.value;
        if (!newTime) {
            setSelectedTime('');
            return;
        }

        // Validar que la hora corresponda con el turno
        const [hours] = newTime.split(':').map(Number);
        const lunchOpen = parseInt(config.openingHours[SHIFTS.LUNCH]?.open?.split(':')[0]) || 13;
        const lunchClose = parseInt(config.openingHours[SHIFTS.LUNCH]?.close?.split(':')[0]) || 16;
        const dinnerOpen = parseInt(config.openingHours[SHIFTS.DINNER]?.open?.split(':')[0]) || 20;
        const dinnerClose = parseInt(config.openingHours[SHIFTS.DINNER]?.close?.split(':')[0]) || 23;

        // Solo permitir horas dentro de los turnos
        if ((hours >= lunchOpen && hours <= lunchClose) || (hours >= dinnerOpen && hours <= dinnerClose)) {
            setSelectedTime(newTime);
        } else {
            alert('La hora seleccionada debe estar dentro del horario de comidas (13:00-16:00) o cenas (20:00-23:30)');
            return;
        }
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
