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
        currentDate,
        userId
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

        // Validar y formatear los datos
        if (!formData.date || !formData.time || !formData.guests || !formData.shift) {
            setError('Por favor, completa todos los campos');
            setSubmitting(false);
            return;
        }

        // Asegurar que la fecha está en formato YYYY-MM-DD
        const formattedDate = formData.date.split('T')[0];
        
        // Asegurar que la hora está en formato HH:mm:ss
        const formattedTime = formData.time.includes(':') ? formData.time + ':00' : formData.time + ':00:00';
        
        // Asegurar que guests es un número
        const guests = parseInt(formData.guests);
        if (isNaN(guests) || guests <= 0) {
            setError('El número de personas debe ser mayor que 0');
            setSubmitting(false);
            return;
        }

        const reservationData = {
            date: formattedDate,
            time: formattedTime,
            guests: guests,
            shift: formData.shift,
            status: 'pending',
            user_id: userId
        };

        console.log('Submitting reservation with validated data:', reservationData);

        try {
            const response = await fetch('http://localhost:8000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData)
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Error al crear la reserva');
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
