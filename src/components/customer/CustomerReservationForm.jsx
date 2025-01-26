import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerReservationForm.css';

export default function CustomerReservationForm({ onReservationCreated }) {
  const [formData, setFormData] = useState({
    datetime: '',
    guests: ''
  });
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const date = new Date(formData.datetime);
      if (isNaN(date.getTime())) {
        setError('La fecha proporcionada no es válida');
        return;
      }

      const formattedData = {
        ...formData,
        datetime: date.toISOString().slice(0, 19).replace('T', ' '),
        guests: parseInt(formData.guests) || 1,
        user_id: user.id,
        status: 'pending'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setFormData({ datetime: '', guests: '' });
      if (onReservationCreated) {
        onReservationCreated();
      }
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.errors) {
        const errorMessages = Object.values(err.errors)
          .flat()
          .join(', ');
        setError(errorMessages);
      } else {
        setError('Error al crear la reserva');
      }
    }
  };

  return (
    <div className="reservation-form">
      <h2 className="reservation-form__title">Nueva Reserva</h2>
      
      {error && (
        <div className="reservation-form__error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="reservation-form__form">
        <div className="reservation-form__group">
          <label className="reservation-form__label">
            Fecha y hora
          </label>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            className="reservation-form__input"
            required
          />
        </div>

        <div className="reservation-form__group">
          <label className="reservation-form__label">
            Número de personas
          </label>
          <input
            type="number"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="reservation-form__input"
            required
            min="1"
          />
        </div>

        <div className="reservation-form__actions">
          <button
            type="button"
            onClick={onReservationCreated}
            className="reservation-form__button reservation-form__button--secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="reservation-form__button reservation-form__button--primary"
          >
            Crear Reserva
          </button>
        </div>
      </form>
    </div>
  );
}
