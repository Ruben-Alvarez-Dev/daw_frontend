import React, { useEffect } from 'react';
import useShiftAvailability from '../../../hooks/useShiftAvailability';
import './TimeSelector.css';

const TimeSelector = ({ 
    selectedTime = '',
    onTimeSelect,
    config,
    reservations = [],
    selectedDate,
    shift = 'lunch'
}) => {
    // Validar props requeridos
    if (!config || !onTimeSelect || !selectedDate) {
        console.warn('TimeSelector: Missing required props');
        return null;
    }

    const availableSlots = useShiftAvailability(config, reservations, selectedDate, shift);

    // Select first available time if none selected
    useEffect(() => {
        if (!selectedTime && availableSlots.length > 0) {
            onTimeSelect(availableSlots[0].time);
        }
    }, [availableSlots, selectedTime, onTimeSelect]);

    if (!availableSlots.length) {
        return <p className="no-slots-message">No hay horarios disponibles para este día</p>;
    }

    return (
        <div className="time-selector-container">
            <select
                value={selectedTime}
                onChange={(e) => onTimeSelect(e.target.value)}
                className="time-selector"
                required
            >
                <option value="">Seleccionar hora</option>
                {availableSlots.map(({ time, available }) => (
                    <option key={time} value={time}>
                        {time} ({available} {available === 1 ? 'mesa disponible' : 'mesas disponibles'})
                    </option>
                ))}
            </select>
            <small className="time-info">
                Comida: 13:00 - 16:00 | Cena: 20:00 - 23:30
            </small>
        </div>
    );
};

export default TimeSelector;
