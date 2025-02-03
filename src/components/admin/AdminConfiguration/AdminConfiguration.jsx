import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { configurationFields } from '../../../config/formFields';
import { configurationService } from '../../../services/api/configuration';
import Form from '../../common/Form/Form';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import './AdminConfiguration.css';

export default function AdminConfiguration() {
    const { token } = useAuth();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await configurationService.getConfiguration(token);
            setConfig(data);
        } catch (err) {
            setError(err.message || 'Error al cargar la configuración');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, [token]);

    // Si no hay configuración aún, mostrar loading
    if (!config) {
        return (
            <div className="admin-configuration">
                <Card
                    header="Configuración del Restaurante"
                    body={<div>Cargando configuración...</div>}
                />
            </div>
        );
    }

    // Añadir los valores actuales a los campos
    const fields = configurationFields.map(field => ({
        ...field,
        value: field.name.includes('.')
            ? field.name.split('.').reduce((obj, key) => obj?.[key], config) || ''
            : config?.[field.name] || ''
    }));

    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            setError('');
            await configurationService.updateConfiguration(token, formData);
            await loadConfig();
        } catch (err) {
            setError(err.message || 'Error al actualizar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        if (window.confirm('¿Estás seguro de que quieres restaurar los valores por defecto? Esta acción no se puede deshacer.')) {
            try {
                setLoading(true);
                setError('');
                await configurationService.restoreDefaults(token);
                await loadConfig();
            } catch (err) {
                setError(err.message || 'Error al restaurar la configuración');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="admin-configuration">
            <Card
                header="Configuración del Restaurante"
                body={
                    <Form
                        id="configForm"
                        fields={fields}
                        error={error}
                        onSubmit={handleSubmit}
                        disabled={loading}
                    >
                        <Button 
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            Guardar cambios
                        </Button>
                    </Form>
                }
                footer={
                    <div className="admin-configuration__buttons">
                        <Button 
                            type="button"
                            variant="secondary"
                            onClick={handleRestore}
                            disabled={loading}
                        >
                            {loading ? 'Restaurando...' : 'Restaurar valores por defecto'}
                        </Button>
                    </div>
                }
            />
        </div>
    );
}
