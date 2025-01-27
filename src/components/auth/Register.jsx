import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../layout/Modal/Modal';
import Button from '../layout/Button/Button';
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
    <Modal
      isOpen={true}
      onClose={() => navigate('/')}
      title="Registro"
    >
      <div className="modal-body">
        {error && <p className="register-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
          <div className="register-input-group">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nombre (opcional)"
              className="register-input"
              autoComplete="off"
            />
            
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Correo electrónico"
              className="register-input"
              autoComplete="off"
            />

            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Teléfono"
              className="register-input"
              autoComplete="off"
            />

            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Contraseña"
              required
              className="register-input"
              autoComplete="new-password"
            />

            <input
              type="password"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              placeholder="Confirmar contraseña"
              required
              className="register-input"
              autoComplete="new-password"
            />
          </div>

          <p className="register-info">
            Debes proporcionar al menos un email o un teléfono
          </p>

          <div className="modal-footer">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              label="Registrarse"
            />
          </div>
        </form>

        <div className="register-footer">
          <span>¿Ya tienes una cuenta?</span>
          <Link to="/login" className="register-link">
            Inicia sesión
          </Link>
        </div>
      </div>
    </Modal>
  );
}
