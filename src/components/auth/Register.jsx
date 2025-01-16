import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Registro</h2>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" autoComplete="off">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nombre (opcional)"
                autoComplete="off"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
            
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Correo electrónico"
                autoComplete="off"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Teléfono"
                autoComplete="off"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Contraseña"
                required
                autoComplete="new-password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <input
                type="password"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                placeholder="Confirmar contraseña"
                required
                autoComplete="new-password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Registrarse
            </button>
          </div>

          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
