import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: ''
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email && !formData.phone) {
      setError('Debes proporcionar un email o un teléfono');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const data = await register(formData);
      navigate('/reservations');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0];
        setError(firstError[0]);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error en el registro');
      }
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h2 className="auth__title">Registro</h2>
          {error && <p className="auth__error">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="auth__form auth__form--register" autoComplete="off">
          <div className="auth__input-group">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nombre (opcional)"
              autoComplete="off"
              className="auth__input auth__input--optional"
            />
            
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Correo electrónico"
              autoComplete="off"
              className="auth__input auth__input--required"
            />

            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Teléfono"
              autoComplete="off"
              className="auth__input auth__input--required"
            />

            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Contraseña"
              required
              autoComplete="new-password"
              className="auth__input auth__input--required"
            />

            <input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              placeholder="Confirmar contraseña"
              required
              autoComplete="new-password"
              className="auth__input auth__input--required"
            />
          </div>

          <button type="submit" className="auth__button">
            Registrarse
          </button>

          <div className="auth__link-container">
            <Link to="/login" className="auth__link">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
