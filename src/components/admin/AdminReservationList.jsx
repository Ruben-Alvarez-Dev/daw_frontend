import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminReservationList.css';

const AdminReservationList = forwardRef(({ onEdit }, ref) => {
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
    } catch (err) {
      setError(err.message);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchReservations
  }));

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la reserva');
      }

      fetchReservations();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <ul className="admin-reservations-list">
        {reservations.map(reservation => (
          <li key={reservation.id} className="reservation-item">
            <div className="reservation-line">
              <span className="reservation-field">ID: {reservation.id}</span>
              <span>User: {reservation.user_info?.name}
                {reservation.user_info?.email && `, ${reservation.user_info.email}`}
                {reservation.user_info?.phone && `, ${reservation.user_info.phone}`}
              </span>
            </div>
            <div className="reservation-line">
              <span className="reservation-field">Guests: {reservation.guests}</span>
              <span>Date & Time: {new Date(reservation.datetime).toLocaleString()}</span>
            </div>
            <div className="reservation-line">
              <span className="reservation-field">Tables: {reservation.tables_ids ? reservation.tables_ids.join(', ') : '-'}</span>
              <span className="reservation-field">Status: {reservation.status}</span>
              <div className="button-group">
                <button className="edit-button" onClick={() => onEdit(reservation)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(reservation.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminReservationList;
