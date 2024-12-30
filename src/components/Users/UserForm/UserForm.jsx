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
    const { userActive, clearUserActive, setUserActive } = useApp();
    const [isEditing, setIsEditing] = useState(!userActive);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initialFormState = {
        id: '',
        name: '',
        email: '',
        role: ROLES.CUSTOMER,
        password: '',
        phone: '',
        address: '',
        visits: 0,
        comments: '',
        created_by: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (userActive) {
            setFormData({
                ...userActive,
                password: '' // No mostramos la contraseña por seguridad
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
        
        try {
            setLoading(true);
            setError(null);

            const dataToSend = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                password: formData.password
            };

            if (formData.phone) {
                dataToSend.phone = formData.phone.trim();
            }

            if (formData.address) {
                dataToSend.address = formData.address.trim();
            }

            if (formData.comments) {
                dataToSend.comments = formData.comments.trim();
            }

            let response;
            if (userActive) {
                // Si estamos editando y no hay contraseña nueva, no la enviamos
                if (!formData.password || formData.password.trim() === '') {
                    delete dataToSend.password;
                }
                response = await fetch(`http://localhost:8000/api/users/${userActive.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
            } else {
                if (!formData.password || formData.password.trim() === '') {
                    throw new Error('La contraseña es obligatoria para nuevos usuarios');
                }
                response = await fetch('http://localhost:8000/api/users', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar el usuario');
            }

            // Obtener los datos actualizados del usuario
            const updatedUser = await response.json();
            setUserActive(updatedUser); // Actualizar el usuario activo con los datos nuevos
            setIsEditing(false);

        } catch (err) {
            console.error('Error completo:', err);
            setError(err.message || 'Error al guardar el usuario');
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
        if (isEditing) {
            handleSubmit({ preventDefault: () => {} });
        } else {
            setIsEditing(true);
        }
    };

    return (
        <Card
            id={id}
            header={<h2>{isEditing ? (userActive ? 'Editar Usuario' : 'Nuevo Usuario') : 'Detalles de Usuario'}</h2>}
            body={
                <form className="user-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    {userActive && (
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input
                                type="text"
                                id="id"
                                value={formData.id}
                                disabled
                                className="readonly-field"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Nombre de usuario</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Nombre de usuario"
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
                            required
                            disabled={!isEditing || loading}
                            placeholder="email@ejemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Rol</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            disabled={!isEditing || loading}
                        >
                            {Object.values(ROLES).map(role => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            placeholder="Teléfono (opcional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            placeholder="Dirección (opcional)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="visits">Visitas</label>
                        <input
                            type="number"
                            id="visits"
                            value={formData.visits || 0}
                            disabled
                            className="readonly-field"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comments">Comentarios</label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments || ''}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            placeholder="Comentarios (opcional)"
                            rows="3"
                        />
                    </div>

                    {formData.created_by && (
                        <div className="form-group">
                            <label htmlFor="created_by">Creado por</label>
                            <input
                                type="text"
                                id="created_by"
                                value={formData.created_by}
                                disabled
                                className="readonly-field"
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div className="form-group">
                            <label htmlFor="password">
                                Contraseña {userActive && '(dejar en blanco para mantener)'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!userActive}
                                disabled={loading}
                                placeholder={userActive ? '(Sin cambios)' : 'Contraseña'}
                                autoComplete="new-password"
                            />
                        </div>
                    )}
                </form>
            }
            footer={
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="button"
                        onClick={toggleEdit}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (isEditing ? 'Guardar' : 'Editar')}
                    </button>
                    <button 
                        type="button" 
                        className="button"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            }
        />
    );
};

UserForm.propTypes = {
    id: PropTypes.string.isRequired
};

export default UserForm;
