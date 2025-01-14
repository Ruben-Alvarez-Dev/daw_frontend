import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: loginFn } = useAuth();

  useEffect(() => {
    // Limpiar el formulario cuando el componente se monta
    setFormData({
      identifier: '',
      password: ''
    });
  }, []);

  const validateIdentifier = (identifier) => {
    // Si solo contiene números
    if (/^\d+$/.test(identifier)) {
      return { isValid: true, type: 'phone' };
    }
    // Si contiene @
    else if (identifier.includes('@')) {
      return { isValid: true, type: 'email' };
    }
    // Si contiene letras pero no @
    else if (/[a-zA-Z]/.test(identifier)) {
      return { isValid: false, type: null };
    }
    // Cualquier otro caso
    return { isValid: false, type: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { isValid, type } = validateIdentifier(formData.identifier);
    
    if (!isValid) {
      setError('El identificador debe ser un email válido o un número de teléfono');
      return;
    }

    try {
      const credentials = {
        password: formData.password,
        [type]: formData.identifier
      };

      const response = await fetch('http://localhost:8000/api/login', {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Iniciar sesión</h2>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" autoComplete="off">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.identifier}
                onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                placeholder="Email o teléfono"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Contraseña"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
            ¿No tienes una cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}