import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../common/Card/Card';
import Form from '../../common/Form/Form';
import Button from '../../common/Button/Button';
import './AdminTableForm.css';

export default function AdminTableForm({ table, onSave, onCancel }) {
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fields = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre de la Mesa',
            required: true,
            value: table?.name || ''
        },
        {
            name: 'capacity',
            type: 'number',
            placeholder: 'Capacidad',
            required: true,
            value: table?.capacity || ''
        },
        {
            name: 'status',
            type: 'select',
            required: true,
            value: table?.status || 'available',
            defaultValue: 'available',
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al guardar mesa');
            }

            onSave(data);
        } catch (err) {
            console.error('Error saving table:', err);
            setError(err.message);
        }
    };

    return (
        <Card
            header={<h3>{table ? 'Editar Mesa' : 'Nueva Mesa'}</h3>}
            footer={
                <div className="form__actions">
                    <Button
                        variant="primary"
                        onClick={() => document.getElementById('tableForm').requestSubmit()}
                    >
                        {table ? 'Actualizar' : 'Crear'}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                </div>
            }
        >
            <Form
                id="tableForm"
                fields={fields}
                error={error}
                onSubmit={handleSubmit}
                hideActions
            />
        </Card>
    );
}
