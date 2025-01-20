import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfiguration } from '../../context/ConfigurationContext';
import './AdminReservationForm.css';

export default function AdminReservationForm({ onReservationCreated, editingReservation }) {
  const [formData, setFormData] = useState({
    user_id: '',
    datetime: '',
    guests: '',
    status: 'pending'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [error, setError] = useState('');
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    phone: ''
  });
  const { token } = useAuth();
  const { config } = useConfiguration();
  const [timeOptions, setTimeOptions] = useState([]);
  const statusOptions = [
    'pending',
    'confirmed',
    'cancelled',
    'completed'
  ];

  useEffect(() => {
    if (config) {
      const options = [];
      const shifts = Object.keys(config.openingHours || {});
      
      shifts.forEach(shift => {
        const { open, close, interval } = config.openingHours[shift];
        const [openHour, openMinute] = open.split(':').map(Number);
        const [closeHour, closeMinute] = close.split(':').map(Number);
        
        let currentTime = new Date();
        currentTime.setHours(openHour, openMinute, 0);
        
        const closeTime = new Date();
        closeTime.setHours(closeHour, closeMinute, 0);
        
        while (currentTime <= closeTime) {
          const timeString = currentTime.toTimeString().slice(0, 5);
          // Si hay una fecha seleccionada, usar el formato completo
          if (formData.datetime) {
            const [date] = formData.datetime.split('T');
            options.push(`${date}T${timeString}`);
          } else {
            // Si no hay fecha, solo guardar la hora
            options.push(timeString);
          }
          currentTime.setMinutes(currentTime.getMinutes() + (interval || 30));
        }
      });
      
      setTimeOptions(options);
    }
  }, [config, formData.datetime]);

  useEffect(() => {
    if (editingReservation) {
      setFormData({
        user_id: editingReservation.user_id,
        datetime: editingReservation.datetime.slice(0, 16),
        guests: editingReservation.guests,
        status: editingReservation.status
      });
      setSelectedTables(editingReservation.tables_ids || []);
      setSearchTerm(`${editingReservation.user_info?.name} (${editingReservation.user_info?.phone})`);
    }
  }, [editingReservation]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tables', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cargar las mesas');

        const data = await response.json();
        setAvailableTables(data);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchTables();
  }, [token]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm) {
        setUserResults([]);
        setShowQuickCreate(false);
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
        const filteredUsers = data.filter(user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setUserResults(filteredUsers);
        
        const isUserSelected = searchTerm.includes('(') && searchTerm.includes(')');
        setShowQuickCreate(searchTerm.length >= 3 && filteredUsers.length === 0 && !isUserSelected);

        const isPhone = /^\d+$/.test(searchTerm);
        setNewUserData({
          name: isPhone ? '' : searchTerm,
          phone: isPhone ? searchTerm : ''
        });

      } catch (err) {
        console.error('Error:', err);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, token]);

  const createAndSelectUser = async () => {
    if (!newUserData.name.trim() || !newUserData.phone.trim()) {
      setError('Por favor, introduce tanto el nombre como el teléfono');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: newUserData.name,
          phone: newUserData.phone
        })
      });

      if (!response.ok) throw new Error('Error al crear el usuario');

      const newUser = await response.json();
      
      setFormData(prev => ({ ...prev, user_id: newUser.user.id }));
      setSearchTerm(`${newUser.user.name} (${newUser.user.phone})`);
      setShowQuickCreate(false);
      setUserResults([]);
      setError('');
      
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message);
    }
  };

  const toggleTable = (tableId) => {
    setSelectedTables(prev => 
      prev.includes(tableId)
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.user_id) {
      setError('Por favor, seleccione un usuario');
      return;
    }

    try {
      const url = editingReservation
        ? `http://localhost:8000/api/reservations/${editingReservation.id}`
        : 'http://localhost:8000/api/reservations';

      const method = editingReservation ? 'PUT' : 'POST';

      const formattedDatetime = formData.datetime.replace('T', ' ');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: parseInt(formData.user_id),
          datetime: formattedDatetime,
          guests: parseInt(formData.guests),
          status: formData.status || 'pending',
          tables_ids: selectedTables
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la reserva');
      }

      const data = await response.json();
      
      setFormData({
        user_id: '',
        datetime: '',
        guests: '',
        status: 'pending'
      });
      setSelectedTables([]);
      
      if (onReservationCreated) {
        onReservationCreated(data.reservation);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const selectUser = (user) => {
    setFormData(prev => ({ ...prev, user_id: user.id }));
    setSearchTerm(`${user.name} (${user.phone})`);
    setUserResults([]);
    setShowQuickCreate(false);
  };

  const clearForm = () => {
    setFormData({
      user_id: '',
      datetime: '',
      guests: '',
      status: 'pending'
    });
    setSearchTerm('');
    setSelectedTables([]);
    setShowQuickCreate(false);
    setNewUserData({ name: '', phone: '' });
    
    if (editingReservation && onReservationCreated) {
      onReservationCreated();
    }
  };

  const renderDateTimeField = () => {
    const dateValue = formData.datetime.split('T')[0];
    const timeValue = formData.datetime.split('T')[1];

    return (
      <div className="form-group">
        <label>Fecha y Hora:</label>
        <div className="datetime-inputs">
          <input
            type="date"
            value={dateValue || ''}
            onChange={(e) => {
              const newDate = e.target.value;
              const newTime = timeValue || (timeOptions.length > 0 ? timeOptions[0] : '');
              setFormData(prev => ({
                ...prev,
                datetime: newDate + (newTime ? `T${newTime}` : '')
              }));
            }}
          />
          <select
            value={timeValue || ''}
            onChange={(e) => {
              const newTime = e.target.value;
              setFormData(prev => ({
                ...prev,
                datetime: dateValue 
                  ? `${dateValue}T${newTime}`
                  : ''
              }));
            }}
          >
            <option value="">Selecciona hora</option>
            {timeOptions.map(time => {
              const displayTime = time.includes('T') ? time.split('T')[1] : time;
              return (
                <option key={time} value={displayTime}>
                  {displayTime}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="reservation-form-container">
      <h3>{editingReservation ? 'Editar Reserva' : 'Nueva Reserva'}</h3>
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
          {(userResults.length > 0 || showQuickCreate) && (
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
              {showQuickCreate && (
                <li className="quick-create">
                  <p>No se encontraron usuarios. ¿Crear nuevo?</p>
                  <div className="quick-create-form">
                    {!/^\d+$/.test(searchTerm) ? (
                      <input
                        type="tel"
                        value={newUserData.phone}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Teléfono"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <input
                        type="text"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <button 
                      type="button"
                      onClick={createAndSelectUser}
                      className="quick-create-button"
                    >
                      Crear y Seleccionar
                    </button>
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        {renderDateTimeField()}

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

        <div className="form-group">
          <label>Mesas Seleccionadas: {selectedTables.length > 0 ? selectedTables.join(', ') : 'Ninguna'}</label>
          <div className="tables-container">
            {availableTables.map(table => (
              <div
                key={table.id}
                onClick={() => toggleTable(table.id)}
                className={`table-chip ${selectedTables.includes(table.id) ? 'selected' : ''}`}
              >
                Mesa {table.id} ({table.capacity} pax)
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit">
            {editingReservation ? 'Actualizar Reserva' : 'Crear Reserva'}
          </button>
          <button type="button" onClick={clearForm} className="clear-button">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
