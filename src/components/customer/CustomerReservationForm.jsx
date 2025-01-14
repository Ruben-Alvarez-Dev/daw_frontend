import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CustomerReservationForm({ listRef }) {
  const [formData, setFormData] = useState({
    datetime: '',
    guests: '',
    tables_ids: []
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

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
        guests: parseInt(formData.guests) || 1
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

      setFormData({ datetime: '', guests: '', tables_ids: [] });
      
      if (listRef && listRef.current) {
        listRef.current.refresh();
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
      <h2>Nueva Reserva</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          value={formData.datetime}
          onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Número de personas"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
          required
          min="1"
        />
        <button type="submit">Crear Reserva</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
