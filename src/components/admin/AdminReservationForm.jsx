import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminReservationForm({ onReservationCreated }) {
  const [formData, setFormData] = useState({
    datetime: '',
    guests: ''
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          guests: parseInt(formData.guests),
          tables_ids: []
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setFormData({
        datetime: '',
        guests: ''
      });

      if (onReservationCreated) {
        onReservationCreated();
      }
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Error al crear la reserva');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Número de personas"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Crear Reserva
        </button>
      </form>
    </div>
  );
}
