import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfiguration } from '../../context/ConfigurationContext';
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginFn } = useAuth();
  const { fetchConfig } = useConfiguration();

  useEffect(() => {
    // Limpiar el formulario cuando el componente se monta
    setFormData({
      identifier: '',
      password: ''
    });
  }, []);

  const validateIdentifier = (identifier) => {
    // Si contiene @ es email, si no es teléfono
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

      // Primero hacemos login
      await loginFn(data.authorisation.token, data.user);
      
      // Después cargamos la configuración
      await fetchConfig();
      
      // Y finalmente navegamos según el rol
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
    <div className="auth">
      <div className="auth__container">
        <div className="auth__header">
          <h2 className="auth__title">Iniciar sesión</h2>
          {error && <p className="auth__error">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="auth__form" autoComplete="off">
          <div className="auth__input-group">
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={(e) => setFormData({...formData, identifier: e.target.value})}
              placeholder="Email o teléfono"
              required
              className="auth__input"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Contraseña"
              required
              className="auth__input"
            />
          </div>

          <button type="submit" className="auth__button">
            Iniciar sesión
          </button>

          <div className="auth__link-container">
            <Link to="/register" className="auth__link">
              ¿No tienes una cuenta? Regístrate
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}