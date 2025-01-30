import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';
import './AdminUserForm.css';

export default function AdminUserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'customer'
  });
  const [errors, setErrors] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'customer'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'customer'
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!user) { // Solo validar email y contraseña para nuevos usuarios
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Las contraseñas no coinciden';
      }
    }

    if (formData.phone && !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const url = user 
        ? `${import.meta.env.VITE_API_URL}/users/${user.id}`
        : `${import.meta.env.VITE_API_URL}/users`;
      
      const method = user ? 'PUT' : 'POST';
      
      // Solo incluir la contraseña si se ha proporcionado una nueva
      const dataToSend = {
        ...formData,
        password: formData.password || undefined,
        password_confirmation: formData.password_confirmation || undefined
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el usuario');
      }

      onSave();
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'customer'
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-user-form">
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <div className="form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          disabled={user}
        />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Teléfono</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
          placeholder="123456789"
        />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>

      {!user && (
        <>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirmar Contraseña</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? 'error' : ''}
            />
            {errors.password_confirmation && (
              <span className="field-error">{errors.password_confirmation}</span>
            )}
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="role">Rol</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="customer">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="form-actions">
        <Button 
          type="submit" 
          variant="success" 
          label={user ? "Actualizar Usuario" : "Crear Usuario"}
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
