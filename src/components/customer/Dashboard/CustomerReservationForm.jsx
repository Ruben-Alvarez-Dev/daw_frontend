import { useState } from 'react';
import Button from '../../../components/common/Button/Button';
import './CustomerReservationForm.css';

export default function CustomerReservationForm({ onReservationCreated, token }) {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: '',
        shift: 'lunch'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Actualizar el turno basado en la hora
            ...(name === 'time' && {
                shift: value >= '12:00' && value <= '16:00' ? 'lunch' : 
                       value >= '20:00' && value <= '23:59' ? 'dinner' : 
                       prev.shift
            })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validar horario
            const time = formData.time;
            const isLunchTime = time >= '12:00' && time <= '16:00';
            const isDinnerTime = time >= '20:00' && time <= '23:59';

            if (!isLunchTime && !isDinnerTime) {
                throw new Error('El horario debe ser entre 12:00-16:00 (comida) o 20:00-23:59 (cena)');
            }

            const response = await fetch('http://localhost:8000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: 2,
                    date: formData.date,
                    time: formData.time,
                    guests: parseInt(formData.guests),
                    shift: formData.shift,
                    status: 'pending'
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al crear la reserva');
            }

            setFormData({
                date: '',
                time: '',
                guests: '',
                shift: 'lunch'
            });
            onReservationCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                />
            </div>

            <div className="form-group">
                <label htmlFor="time">Hora:</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
                <small>Comida: 12:00-16:00, Cena: 20:00-23:59</small>
            </div>

            <div className="form-group">
                <label htmlFor="guests">Número de personas:</label>
                <input
                    type="number"
                    id="guests"
                    name="guests"
                    min="1"
                    max="10"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Turno:</label>
                <div className="shift-display">
                    {formData.shift === 'lunch' ? 'Comida' : 'Cena'}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <Button
                type="submit"
                variant="primary"
                disabled={loading}
                label={loading ? 'Creando...' : 'Crear Reserva'}
            />
        </form>
    );
}
