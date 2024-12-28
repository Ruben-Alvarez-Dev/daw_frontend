import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.password_confirmation) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error en registro:', err);
            setError('Error al registrar usuario. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Registro</h2>
                
                {error && (
                    <div className="register-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-form-group">
                        <label className="register-label">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label className="register-label">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="register-input"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <p className="register-login-link">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
