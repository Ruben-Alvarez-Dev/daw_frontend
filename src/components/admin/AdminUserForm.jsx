import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminUserForm.css';

export default function AdminUserForm({ onUserCreated, editingUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone || '',
        password: '',
        role: editingUser.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'client'
      });
    }
  }, [editingUser]);

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'client'
    });
    setError('');
    
    // Si estamos en modo edición, notificar al padre para salir de ese modo
    if (editingUser && onUserCreated) {
      onUserCreated();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingUser 
        ? `http://localhost:8000/api/users/${editingUser.id}`
        : 'http://localhost:8000/api/users';

      const method = editingUser ? 'PUT' : 'POST';

      // Si estamos editando y no se ha cambiado la contraseña, no la enviamos
      const dataToSend = {...formData};
      if (editingUser && !formData.password) {
        delete dataToSend.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'client'
      });

      if (onUserCreated) {
        onUserCreated();
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.message) {
        setError(err.message);
      } else if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Error al procesar la solicitud');
      }
    }
  };

  return (
    <div className="admin-user-form">
      <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder={editingUser ? "Contraseña (dejar vacío para mantener)" : "Contraseña"}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required={!editingUser}
          />
        </div>

        <div className="form-group">
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
          >
            <option value="client">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-button">
            {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
          </button>
          <button type="button" onClick={clearForm} className="clear-button">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}
