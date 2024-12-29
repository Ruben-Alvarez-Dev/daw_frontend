import { useState, useEffect } from 'react';
import Card from '../../common/Card/Card';
import './UserForm.css';
import PropTypes from 'prop-types';
import { createUser, updateUser } from '../../../services/api.js';
import { useAuth } from '../../../context/AuthContext';

// Definimos los roles válidos como constante para mantener consistencia
const ROLES = {
    CUSTOMER: 'customer',
    SUPERVISOR: 'supervisor',
    ADMIN: 'admin'
};

const UserForm = ({ id, isActive, onActivate, selectedUser, onUpdate }) => {
    const { token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ROLES.CUSTOMER,
        password: ''
    });

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                ...selectedUser,
                password: '' // No mostramos la contraseña por seguridad
            });
            setIsEditing(false);
        } else {
            // Si no hay usuario seleccionado, limpiamos el formulario
            setFormData({
                name: '',
                email: '',
                role: ROLES.CUSTOMER,
                password: ''
            });
            setIsEditing(true); // Activamos edición para nuevo usuario
        }
        setError(null);
    }, [selectedUser]);

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

            // Preparamos los datos a enviar
            const dataToSend = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role,
                password: formData.password // Siempre incluimos password para nuevos usuarios
            };

            let response;
            if (selectedUser) {
                // Si hay password y no está vacío, lo incluimos en la actualización
                if (!formData.password || formData.password.trim() === '') {
                    delete dataToSend.password;
                }
                response = await updateUser(token, selectedUser.id, dataToSend);
            } else {
                // Para nuevos usuarios, password es obligatorio
                if (!formData.password || formData.password.trim() === '') {
                    throw new Error('La contraseña es obligatoria para nuevos usuarios');
                }
                response = await createUser(token, dataToSend);
            }

            setIsEditing(false);
            if (onUpdate) {
                onUpdate(); // Notificamos al padre para que actualice la lista
            }
        } catch (err) {
            console.error('Error completo:', err);
            setError(err.message || 'Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            email: '',
            role: ROLES.CUSTOMER,
            password: ''
        });
        setIsEditing(true);
        setError(null);
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
            isActive={isActive}
            onActivate={onActivate}
            header={<h2>{isEditing ? (selectedUser ? 'Editar Usuario' : 'Nuevo Usuario') : 'Detalles de Usuario'}</h2>}
            body={
                <form className="user-form" onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}
                    <div>
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
                    <div>
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
                    <div>
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
                    {isEditing && (
                        <div>
                            <label htmlFor="password">
                                Contraseña {selectedUser && '(dejar en blanco para mantener)'}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!selectedUser}
                                disabled={loading}
                                placeholder={selectedUser ? '(Sin cambios)' : ''}
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
                        Limpiar
                    </button>
                </div>
            }
        />
    );
};

UserForm.propTypes = {
    id: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onActivate: PropTypes.func.isRequired,
    selectedUser: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.oneOf(Object.values(ROLES))
    }),
    onUpdate: PropTypes.func
};

export default UserForm;
