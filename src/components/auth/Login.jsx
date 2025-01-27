import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurantConfig } from '../../context/RestaurantConfigContext';
import Modal from '../layout/Modal/Modal';
import Button from '../layout/Button/Button';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginFn } = useAuth();
  const { fetchConfig } = useRestaurantConfig();

  useEffect(() => {
    setFormData({
      identifier: '',
      password: ''
    });
  }, []);

  const validateIdentifier = (identifier) => {
    return identifier.includes('@') ? { type: 'email' } : { type: 'phone' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { type } = validateIdentifier(formData.identifier);
    
    try {
      const credentials = {
        password: formData.password,
        [type]: formData.identifier
      };

      const endpoint = type === 'email' ? 'login/email' : 'login/phone';
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      await loginFn(data.authorisation.token, data.user);
      await fetchConfig();
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => navigate('/')}
      title="Iniciar Sesión"
    >
      <div className="modal-body">
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="login-input-group">
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              placeholder="Email o teléfono"
              required
              className="login-input"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Contraseña"
              required
              className="login-input"
            />
          </div>

          <div className="modal-footer">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              label="Iniciar Sesión"
            />
          </div>
        </form>

        <div className="login-footer">
          <span>¿No tienes una cuenta?</span>
          <Link to="/register" className="login-link">
            Regístrate
          </Link>
        </div>
      </div>
    </Modal>
  );
}