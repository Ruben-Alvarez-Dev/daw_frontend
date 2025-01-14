import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminTableForm({ listRef }) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: ''
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name,
          capacity: parseInt(formData.capacity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setFormData({
        name: '',
        capacity: ''
      });

      if (listRef && listRef.current) {
        listRef.current.refresh();
      }
    } catch (err) {
      console.error('Error al crear mesa:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Error al crear mesa');
      }
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Nueva Mesa</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nombre de mesa"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Capacidad"
            value={formData.capacity}
            onChange={(e) => setFormData({...formData, capacity: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Mesa
        </button>
      </form>
    </div>
  );
}
