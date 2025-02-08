import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './CustomerPersonalData.css';

const CustomerPersonalData = () => {
    const { user, token, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [error, setError] = useState('');

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

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar los datos');
            }

            const updatedUser = await response.json();
            console.log('Usuario actualizado:', updatedUser);
            updateUser(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error('Error al actualizar:', err);
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || ''
        });
        setError('');
        setIsEditing(false);
    };

    const getInitials = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre completo</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Teléfono</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-buttons">
                    <button type="submit" className="save-button">Guardar</button>
                    <button 
                        type="button" 
                        className="cancel-button"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="personal-data-container">
            <div className="avatar-circle">
                {getInitials(user?.name)}
            </div>
            
            <div className="data-cards">
                <div className="data-card">
                    <h3>Nombre completo</h3>
                    <p>{user?.name}</p>
                </div>
                
                <div className="data-card">
                    <h3>Email</h3>
                    <p>{user?.email}</p>
                </div>
                
                <div className="data-card">
                    <h3>Teléfono</h3>
                    <p>{user?.phone}</p>
                </div>
                
                <div className="data-card">
                    <h3>Fecha de registro</h3>
                    <p>{formatDate(user?.created_at)}</p>
                </div>
            </div>

            <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
            >
                Editar datos
            </button>
        </div>
    );
};

export default CustomerPersonalData;
