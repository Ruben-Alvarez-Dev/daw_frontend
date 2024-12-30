import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../../common/Card/Card';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import './UserForm.css';

const ROLES = {
    CUSTOMER: 'customer',
    SUPERVISOR: 'supervisor',
    ADMIN: 'admin'
};

const UserForm = ({ id }) => {
    const { token } = useAuth();
    const { userActive, clearUserActive } = useApp();
    const [isEditing, setIsEditing] = useState(!userActive);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initialFormState = {
        id: '',
        name: '',
        email: '',
        role: ROLES.CUSTOMER,
        phone: '',
        address: '',
        visits: 0
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (userActive) {
            setFormData({
                id: userActive.id || '',
                name: userActive.name || '',
                email: userActive.email || '',
                role: userActive.role || ROLES.CUSTOMER,
                phone: userActive.phone || '',
                address: userActive.address || '',
                visits: userActive.visits || 0
            });
            setIsEditing(false);
        } else {
            setFormData({...initialFormState});
            setIsEditing(true);
        }
        setError(null);
    }, [userActive]);

    const handleChange = (e) => {
        if (!isEditing) return;
        
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEditing) return;

        setLoading(true);
        setError(null);

        try {
            const url = userActive 
                ? `http://localhost:8000/api/users/${userActive.id}`
                : 'http://localhost:8000/api/users';
            
            const method = userActive ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al guardar usuario');
            }

            handleClear();
        } catch (err) {
            console.error('Error saving user:', err);
            setError('Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({...initialFormState});
        setIsEditing(true);
        setError(null);
        clearUserActive();
    };

    const toggleEdit = () => {
        if (!userActive) return;
        setIsEditing(!isEditing);
    };

    return (
        <Card
            id={id}
            header={<h2>{isEditing ? (userActive ? 'Editar Usuario' : 'Nuevo Usuario') : 'Detalles de Usuario'}</h2>}
            body={
                <form className="user-form">
                    {error && <div className="error">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="name">Nombre de usuario</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rol</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value={ROLES.CUSTOMER}>Customer</option>
                            <option value={ROLES.SUPERVISOR}>Supervisor</option>
                            <option value={ROLES.ADMIN}>Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="(Opcional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="(Opcional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="visits">Visitas</label>
                        <input
                            type="number"
                            id="visits"
                            name="visits"
                            value={formData.visits}
                            onChange={handleChange}
                            disabled={!isEditing}
                            min="0"
                        />
                    </div>
                </form>
            }
            footer={
                <div className="form-actions">
                    {isEditing ? (
                        <>
                            <button 
                                type="button"
                                onClick={handleSubmit}
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleClear}
                                className="cancel-button"
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <button 
                            type="button" 
                            onClick={toggleEdit}
                            className="edit-button"
                        >
                            Editar
                        </button>
                    )}
                </div>
            }
        />
    );
};

UserForm.propTypes = {
    id: PropTypes.string.isRequired
};

export default UserForm;
