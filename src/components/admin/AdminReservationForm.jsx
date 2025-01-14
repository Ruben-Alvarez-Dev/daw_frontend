import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminReservationForm({ listRef }) {
  const [formData, setFormData] = useState({
    datetime: '',
    guests: ''
  });
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tables_ids: []
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }

      setFormData({ datetime: '', guests: '' });
      if (listRef && listRef.current) {
        listRef.current.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="datetime-local"
        value={formData.datetime}
        onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
      />
      <input
        type="number"
        placeholder="Número de personas"
        value={formData.guests}
        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
      />
      <button type="submit">Crear Reserva</button>
    </form>
  );
}
