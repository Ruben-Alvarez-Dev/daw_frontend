import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getUser, createUser, updateUser } from '../../../services/api';
import { ROLES } from '../../../constants/roles';
import './UserForm.css';

const UserForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: ROLES.WAITER
    });

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const data = await getUser(getToken(), userId);
                    setFormData({
                        ...data,
                        password: '',
                        password_confirmation: ''
                    });
                } catch (err) {
                    setError('Error al cargar el usuario');
                }
            };
            fetchUser();
        }
    }, [getToken, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (userId) {
                await updateUser(getToken(), userId, formData);
            } else {
                await createUser(getToken(), formData);
            }
            navigate('/users');
        } catch (err) {
            setError('Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="user-form-loading">Guardando...</div>;

    return (
        <div className="user-form-container">
            <div className="user-form-card">
                <h2 className="user-form-title">
                    {userId ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
                
                {error && (
                    <div className="user-form-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="user-form">
                    <div className="user-form-group">
                        <label className="user-form-label">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="user-form-input"
                            required
                        />
                    </div>

                    <div className="user-form-group">
                        <label className="user-form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="user-form-input"
                            required
                        />
                    </div>

                    <div className="user-form-group">
                        <label className="user-form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="user-form-input"
                            required={!userId}
                        />
                    </div>

                    <div className="user-form-group">
                        <label className="user-form-label">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="user-form-input"
                            required={!userId}
                        />
                    </div>

                    <div className="user-form-group">
                        <label className="user-form-label">Rol</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="user-form-input"
                            required
                        >
                            <option value={ROLES.ADMIN}>Administrador</option>
                            <option value={ROLES.SUPERVISOR}>Supervisor</option>
                            <option value={ROLES.WAITER}>Camarero</option>
                        </select>
                    </div>

                    <div className="user-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/users')}
                            className="user-form-button user-form-button-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="user-form-button user-form-button-primary"
                            disabled={loading}
                        >
                            {userId ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
