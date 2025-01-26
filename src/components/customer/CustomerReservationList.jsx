import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerReservationList.css';

export default function CustomerReservationList({ onNewReservation }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchReservations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las reservas');
      }

      const data = await response.json();
      setReservations(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error('Error fetching reservations:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const formatDateTime = (datetime) => {
    try {
      const date = new Date(datetime);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return 'Fecha no válida';
    }
  };

  return (
    <div className="reservation-list">
      <div className="reservation-list__header">
        <h2 className="reservation-list__title">Mis Reservas</h2>
        <button
          onClick={onNewReservation}
          className="reservation-list__new-button"
        >
          Nueva Reserva
        </button>
      </div>

      {error && (
        <div className="reservation-list__error">
          {error}
        </div>
      )}

      {!error && reservations.length === 0 ? (
        <p className="reservation-list__empty">No tienes reservas</p>
      ) : (
        <div className="reservation-list__grid">
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              className="reservation-list__item"
            >
              <div className="reservation-list__item-grid">
                <div className="reservation-list__item-field">
                  <span className="reservation-list__item-label">Fecha y hora:</span>
                  <div className="reservation-list__item-value">{formatDateTime(reservation.datetime)}</div>
                </div>
                <div className="reservation-list__item-field">
                  <span className="reservation-list__item-label">Personas:</span>
                  <div className="reservation-list__item-value">{reservation.guests}</div>
                </div>
                <div className="reservation-list__item-field">
                  <span className="reservation-list__item-label">Estado:</span>
                  <div className="reservation-list__item-value">{reservation.status || 'pending'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
