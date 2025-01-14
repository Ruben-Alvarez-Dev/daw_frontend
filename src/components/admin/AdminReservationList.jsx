import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminReservationList = forwardRef((props, ref) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
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
    fetchReservations
  }));

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString();
  };

  return (
    <div>
      <h2>Reservas</h2>
      {error && <p>{error}</p>}
      {!error && reservations.length === 0 ? (
        <p>No hay reservas</p>
      ) : (
        reservations.map((reservation) => (
          <div key={reservation.id}>
            <p>Fecha y hora: {formatDateTime(reservation.datetime)}</p>
            <p>Personas: {reservation.guests}</p>
            <p>Estado: {reservation.status}</p>
            {reservation.tables_ids && reservation.tables_ids.length > 0 && (
              <p>Mesas asignadas: {reservation.tables_ids.join(', ')}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
})

export default AdminReservationList;
