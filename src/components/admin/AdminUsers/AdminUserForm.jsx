import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Form from '../../common/Form/Form';
import Button from '../../common/Button/Button';
import './AdminUserForm.css';

export default function AdminUserForm({ user, onSave, onCancel, isEditing }) {
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fields = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre',
            required: true,
            value: user ? user.name : '',
            disabled: user && !isEditing
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            required: true,
            value: user ? user.email : '',
            disabled: user
        },
        {
            name: 'phone',
            type: 'tel',
            placeholder: 'Teléfono',
            required: true,
            value: user ? user.phone : '',
            disabled: user && !isEditing
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Contraseña',
            required: !user,
            value: '',
            disabled: user && !isEditing
        },
        {
            name: 'password_confirmation',
            type: 'password',
            placeholder: 'Confirmar contraseña',
            required: !user,
            value: '',
            disabled: user && !isEditing
        },
        {
            name: 'role',
            type: 'select',
            placeholder: 'Rol',
            required: true,
            value: user ? user.role : '',
            disabled: user && !isEditing,
            options: [
                { value: '', label: 'Seleccionar rol' },
                { value: 'admin', label: 'admin' },
                { value: 'customer', label: 'customer' }
            ]
        }
    ];

    const handleSubmit = async (formData) => {
        try {
            // Asegurar que phone es string
            const dataToSend = {
                ...formData,
                phone: formData.phone ? formData.phone.toString() : ''
            };

            const url = user
                ? `${import.meta.env.VITE_API_URL}/api/users/${user.id}`
                : `${import.meta.env.VITE_API_URL}/api/users`;

            const method = user ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar usuario');
            }

            onSave();
            setError('');
        } catch (err) {
            console.error('Error saving user:', err);
            setError(err.message);
        }
    };

    return (
        <Form
            fields={fields}
            onSubmit={handleSubmit}
            error={error}
            submitButton={{
                label: user ? 'Actualizar Usuario' : 'Crear Usuario',
                variant: 'primary'
            }}
            onCancel={onCancel}
        />
    );
}
