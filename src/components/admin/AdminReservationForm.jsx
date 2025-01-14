import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminReservationForm.css';

export default function AdminReservationForm({ onReservationCreated }) {
  const [formData, setFormData] = useState({
    user_id: '',
    datetime: '',
    guests: '',
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const statusOptions = [
    'pending',
    'confirmed',
    'cancelled',
    'completed'
  ];

  // Búsqueda de usuarios
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm) {
        setUserResults([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al buscar usuarios');

        const data = await response.json();
        // Filtrar usuarios localmente
        const filteredUsers = data.filter(user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setUserResults(filteredUsers);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.user_id) {
      setError('Por favor, seleccione un usuario');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          datetime: formData.datetime,
          guests: parseInt(formData.guests),
          status: formData.status
        })
      });

      if (!response.ok) throw new Error('Error al crear la reserva');

      const data = await response.json();
      
      setFormData({
        user_id: '',
        datetime: '',
        guests: '',
        status: 'pending'
      });
      setSearchTerm('');
      
      if (onReservationCreated) {
        onReservationCreated(data);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const selectUser = (user) => {
    setFormData(prev => ({ ...prev, user_id: user.id }));
    setSearchTerm(`${user.name} (${user.email || user.phone})`);
    setUserResults([]);
  };

  return (
    <div className="reservation-form-container">
      <h3>Nueva Reserva</h3>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, email o teléfono"
          />
          {userResults.length > 0 && (
            <ul className="user-results">
              {userResults.map(user => (
                <li 
                  key={user.id} 
                  onClick={() => selectUser(user)}
                >
                  {user.name} 
                  {user.email && ` - ${user.email}`}
                  {user.phone && ` - ${user.phone}`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Fecha y Hora</label>
          <input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Número de Invitados</label>
          <input
            type="number"
            value={formData.guests}
            onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            required
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Crear Reserva</button>
      </form>
    </div>
  );
}
