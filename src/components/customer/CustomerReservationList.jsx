import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerReservationList.css';

export default function CustomerReservationList({ onNewReservation }) {
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
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Mis Reservas</h2>
        <button
          onClick={onNewReservation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nueva Reserva
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!error && reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tienes reservas</p>
      ) : (
        <div className="space-y-4">
          {reservations.map(reservation => (
            <div
              key={reservation.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-600">Fecha y hora:</span>
                  <div className="font-medium">{formatDateTime(reservation.datetime)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Personas:</span>
                  <div className="font-medium">{reservation.guests}</div>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <div className="font-medium">{reservation.status || 'pending'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
