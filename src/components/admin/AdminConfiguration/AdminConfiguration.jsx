import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useConfiguration } from '../../../context/ConfigurationContext';
import Form from '../../common/Form/Form';
import Card from '../../common/Card/Card';
import './AdminConfiguration.css';

export default function AdminConfiguration() {
    const { token } = useAuth();
    const { config, updateConfig } = useConfiguration();
    const [error, setError] = useState('');

    const fields = [
        {
            name: 'restaurant_name',
            type: 'text',
            placeholder: 'Nombre del restaurante',
            required: true,
            value: config?.restaurant_name || ''
        },
        {
            name: 'opening_hour',
            type: 'time',
            placeholder: 'Hora de apertura',
            required: true,
            value: config?.opening_hour || ''
        },
        {
            name: 'closing_hour',
            type: 'time',
            placeholder: 'Hora de cierre',
            required: true,
            value: config?.closing_hour || ''
        },
        {
            name: 'time_slot_duration',
            type: 'number',
            placeholder: 'Duración del turno (minutos)',
            required: true,
            value: config?.time_slot_duration || 60
        }
    ];

    const handleSubmit = async (formData) => {
        try {
            await updateConfig(formData);
            setError('');
        } catch (err) {
            setError(err.message || 'Error al actualizar la configuración');
        }
    };

    return (
        <div className="admin-display">
            <div className="admin-content">
                <Card title="Configuración del Restaurante">
                    <Form
                        fields={fields}
                        error={error}
                        onSubmit={handleSubmit}
                        submitButton={{
                            label: 'Guardar cambios',
                            variant: 'primary'
                        }}
                    />
                </Card>
            </div>
        </div>
    );
}
