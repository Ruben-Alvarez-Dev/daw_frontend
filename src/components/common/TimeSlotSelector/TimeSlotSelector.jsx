import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useConfiguration } from '../../../context/ConfigurationContext';
import './TimeSlotSelector.css';

export default function TimeSlotSelector({ selectedDate, value, onChange, disabled }) {
    const { config } = useConfiguration();
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (!selectedDate || !config) return;

        const slots = [];
        const { timeInterval, openingHours } = config;
        const date = new Date(selectedDate);

        // Helper function to convert time string to Date
        const timeToDate = (timeStr, baseDate) => {
            const [hours, minutes] = timeStr.split(':');
            const date = new Date(baseDate);
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return date;
        };

        // Generate afternoon slots
        let currentTime = timeToDate(openingHours.afternoon.open, date);
        const afternoonClose = timeToDate(openingHours.afternoon.close, date);

        while (currentTime <= afternoonClose) {
            slots.push(new Date(currentTime));
            currentTime = new Date(currentTime.getTime() + timeInterval * 60000);
        }

        // Generate evening slots
        currentTime = timeToDate(openingHours.evening.open, date);
        const eveningClose = timeToDate(openingHours.evening.close, date);

        while (currentTime <= eveningClose) {
            slots.push(new Date(currentTime));
            currentTime = new Date(currentTime.getTime() + timeInterval * 60000);
        }

        setTimeSlots(slots);
    }, [selectedDate, config]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!selectedDate || !config) {
        return <select disabled><option>Selecciona una fecha primero</option></select>;
    }

    return (
        <select 
            value={value} 
            onChange={onChange}
            disabled={disabled}
            className="time-slot-selector"
        >
            <option value="">Seleccionar hora</option>
            {timeSlots.map((slot) => (
                <option 
                    key={slot.getTime()} 
                    value={slot.toISOString()}
                >
                    {formatTime(slot)}
                </option>
            ))}
        </select>
    );
}

TimeSlotSelector.propTypes = {
    selectedDate: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};
