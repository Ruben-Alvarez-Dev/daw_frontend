import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../layout/Button/Button';
import './AdminUserForm.css';

export default function AdminUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = user 
        ? `${import.meta.env.VITE_API_URL}/users/${user.id}`
        : `${import.meta.env.VITE_API_URL}/users`;
      
      const method = user ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al guardar el usuario');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'customer'
      });
      
      onSave();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="admin-user-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!user}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Rol:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="customer">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="form-actions">
        <Button 
          type="submit"
          variant="primary"
          label={user ? "Actualizar" : "Crear"}
        />
        {user && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            label="Cancelar"
          />
        )}
      </div>
    </form>
  );
}
