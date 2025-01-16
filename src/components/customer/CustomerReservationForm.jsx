import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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

      const response = await fetch('http://localhost:8000/api/reservations', {
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
        // Mostrar todos los errores de validación
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
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha y hora
          </label>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de personas
          </label>
          <input
            type="number"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            min="1"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onReservationCreated}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Crear Reserva
          </button>
        </div>
      </form>
    </div>
  );
}
