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
    refresh: fetchReservations
  }));

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUserInfo = (user) => {
    if (!user) return 'N/A';
    return `${user.name} (${user.email})`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Reservas</h3>
      {error && <p className="text-red-500">{error}</p>}
      {!error && reservations.length === 0 ? (
        <p className="text-gray-500">No hay reservas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Cliente</th>
                <th className="px-4 py-2 border-b">Personas</th>
                <th className="px-4 py-2 border-b">Fecha y Hora</th>
                <th className="px-4 py-2 border-b">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{reservation.id}</td>
                  <td className="px-4 py-2 border-b">{formatUserInfo(reservation.user)}</td>
                  <td className="px-4 py-2 border-b">{reservation.guests}</td>
                  <td className="px-4 py-2 border-b">{formatDateTime(reservation.datetime)}</td>
                  <td className="px-4 py-2 border-b">{reservation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default AdminReservationList;
