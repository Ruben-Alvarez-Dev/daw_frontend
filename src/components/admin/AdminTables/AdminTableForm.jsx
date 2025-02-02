import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Form from '../../common/Form/Form';
import './AdminTableForm.css';

export default function AdminTableForm({ table, onSave, onCancel, isEditing }) {
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fields = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre de la Mesa',
            required: true,
            value: table?.name || '',
            disabled: table && !isEditing
        },
        {
            name: 'capacity',
            type: 'number',
            placeholder: 'Capacidad',
            required: true,
            value: table?.capacity || '',
            disabled: table && !isEditing
        },
        {
            name: 'status',
            type: 'select',
            placeholder: 'Estado',
            required: true,
            value: table?.status || 'available',
            disabled: table && !isEditing,
            options: [
                { value: 'available', label: 'Disponible' },
                { value: 'blocked', label: 'Bloqueada' },
                { value: 'unavailable', label: 'No disponible' }
            ]
        }
    ];

    const handleSubmit = async (formData) => {
        try {
            setError('');
            const url = table 
                ? `${import.meta.env.VITE_API_URL}/api/tables/${table.id}`
                : `${import.meta.env.VITE_API_URL}/api/tables`;
            
            const method = table ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al guardar mesa');
            }

            onSave();
        } catch (err) {
            console.error('Error saving table:', err);
            setError(err.message);
        }
    };

    return (
        <Form
            fields={fields}
            error={error}
            onSubmit={handleSubmit}
            submitButton={{
                label: table ? 'Actualizar' : 'Crear',
                variant: 'primary'
            }}
            secondaryButton={{
                label: 'Cancelar',
                variant: 'secondary',
                onClick: onCancel
            }}
        />
    );
}
