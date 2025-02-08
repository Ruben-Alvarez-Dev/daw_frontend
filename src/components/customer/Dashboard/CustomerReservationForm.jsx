import React, { useState, useEffect } from 'react';
import useRestaurantConfig from '../../../hooks/useRestaurantConfig';
import TimeSelector from '../../common/TimeSelector/TimeSelector';
import './CustomerReservationForm.css';

const CustomerReservationForm = ({ token, onReservationCreated }) => {
    const { 
        config, 
        configLoading, 
        fetchReservations,
        reservations,
        currentDate
    } = useRestaurantConfig(token);
    
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '',
        shift: 'lunch'
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch reservations when date changes
    useEffect(() => {
        if (formData.date && formData.date !== currentDate) {
            console.log('Fetching reservations for date:', formData.date);
            fetchReservations(formData.date);
        }
    }, [formData.date, currentDate, fetchReservations]);

    // Log reservations when they change
    useEffect(() => {
        if (reservations.length > 0) {
            console.log('Current reservations:', reservations);
        }
    }, [reservations]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError(null);

        const reservationData = {
            date: formData.date,
            time: formData.time,
            guests: parseInt(formData.guests),
            shift: formData.shift,
            status: 'pending'
        };

        console.log('Submitting reservation:', reservationData);

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                throw new Error('Error al crear la reserva');
            }

            // Reset form after successful submission
            setFormData({
                date: '',
                time: '',
                guests: '',
                shift: 'lunch'
            });

            if (onReservationCreated) {
                onReservationCreated();
            }

        } catch (err) {
            console.error('Error creating reservation:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'date' && { time: '' }) // Reset time when date changes
        }));
    };

    if (configLoading) {
        return <div className="loading">Cargando configuración...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="customer-reservation-form">
            <div className="form-group">
                <label htmlFor="date">Fecha:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    disabled={submitting}
                />
            </div>

            <div className="form-group">
                <label htmlFor="time">Hora:</label>
                {formData.date && (
                    <TimeSelector
                        selectedTime={formData.time}
                        onTimeSelect={(time) => handleChange({ target: { name: 'time', value: time } })}
                        config={config}
                        reservations={reservations}
                        selectedDate={formData.date}
                        shift={formData.shift}
                    />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="guests">Personas:</label>
                <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="8"
                    required
                    disabled={submitting}
                />
            </div>

            <button 
                type="submit" 
                className="submit-button"
                disabled={submitting}
            >
                {submitting ? 'Reservando...' : 'Hacer Reserva'}
            </button>

            {error && <div className="error-message">{error}</div>}
        </form>
    );
};

export default CustomerReservationForm;
