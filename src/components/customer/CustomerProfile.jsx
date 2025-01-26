import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerProfile.css';

export default function CustomerProfile() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      setSuccess('Perfil actualizado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="profile">
      <h2 className="profile__title">Mi Perfil</h2>
      
      {error && (
        <div className="profile__message profile__message--error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="profile__message profile__message--success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile__form">
        <div className="profile__form-group">
          <label className="profile__label">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="profile__input"
            required
          />
        </div>

        <div className="profile__form-group">
          <label className="profile__label">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="profile__input"
          />
        </div>

        <div className="profile__form-group">
          <label className="profile__label">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="profile__input"
            required
          />
        </div>

        <button type="submit" className="profile__button">
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
}
