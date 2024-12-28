import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar el error cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error en login:', err);
            setError(err.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Iniciar Sesión</h1>
                
                {error && <div className="login-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-form-group">
                        <label htmlFor="email" className="login-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="login-form-group">
                        <label htmlFor="password" className="login-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="login-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-register-link">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register">Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
