import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerReservationList.css';

const CustomerReservationList = forwardRef((props, ref) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/my-reservations', {
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

  useImperativeHandle(ref, () => ({
    refresh: fetchReservations
  }));

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
    <div>
      <h2>Tus Reservas</h2>
      {error && <p className="error">{error}</p>}
      {!error && reservations.length === 0 ? (
        <p>No tienes reservas</p>
      ) : (
        <div className="reservations-list">
          {reservations.map(reservation => (
            <div key={reservation.id} className="reservation-item">
              <p>Fecha y hora: {formatDateTime(reservation.datetime)}</p>
              <p>Personas: {reservation.guests}</p>
              <p>Estado: {reservation.status || 'pending'}</p>
              {reservation.tables_ids && reservation.tables_ids.length > 0 && (
                <p>Mesas asignadas: {reservation.tables_ids.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default CustomerReservationList;
