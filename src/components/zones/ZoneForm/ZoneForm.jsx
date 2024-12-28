import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getZone, createZone, updateZone } from '../../../services/api';
import './ZoneForm.css';

const ZoneForm = () => {
    const { restaurantId, zoneId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { activeRestaurant } = useApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        zone_name: '',
        zone_capacity: '',
        restaurant_id: restaurantId
    });

    useEffect(() => {
        if (zoneId) {
            const fetchZone = async () => {
                try {
                    const data = await getZone(getToken(), restaurantId, zoneId);
                    setFormData(data);
                } catch (err) {
                    setError('Error al cargar la zona');
                }
            };
            fetchZone();
        }
    }, [getToken, restaurantId, zoneId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (zoneId) {
                await updateZone(getToken(), restaurantId, zoneId, formData);
            } else {
                await createZone(getToken(), restaurantId, formData);
            }
            navigate(`/restaurants/${restaurantId}/zones`);
        } catch (err) {
            setError('Error al guardar la zona');
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

    if (loading) return <div className="zone-form-loading">Guardando...</div>;

    return (
        <div className="zone-form-container">
            <div className="zone-form-card">
                <h2 className="zone-form-title">
                    {zoneId ? 'Editar Zona' : 'Nueva Zona'}
                </h2>
                
                {error && (
                    <div className="zone-form-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="zone-form">
                    <div className="zone-form-group">
                        <label className="zone-form-label">Nombre</label>
                        <input
                            type="text"
                            name="zone_name"
                            value={formData.zone_name}
                            onChange={handleChange}
                            className="zone-form-input"
                            required
                        />
                    </div>

                    <div className="zone-form-group">
                        <label className="zone-form-label">Capacidad</label>
                        <input
                            type="number"
                            name="zone_capacity"
                            value={formData.zone_capacity}
                            onChange={handleChange}
                            className="zone-form-input"
                            required
                        />
                    </div>

                    <div className="zone-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(`/restaurants/${restaurantId}/zones`)}
                            className="zone-form-button zone-form-button-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="zone-form-button zone-form-button-primary"
                            disabled={loading}
                        >
                            {zoneId ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ZoneForm;
