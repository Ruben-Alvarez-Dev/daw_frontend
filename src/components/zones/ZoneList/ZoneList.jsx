import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getZones } from '../../../services/api';
import './ZoneList.css';

const ZoneList = () => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { activeRestaurant } = useApp();

    useEffect(() => {
        const fetchZones = async () => {
            if (!activeRestaurant) return;
            
            try {
                const data = await getZones(getToken(), activeRestaurant.restaurant_id);
                setZones(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las zonas');
                setLoading(false);
            }
        };

        fetchZones();
    }, [getToken, activeRestaurant]);

    if (loading) return <div className="zone-loading">Cargando...</div>;

    return (
        <div className="zone-list">
            <div className="zone-header">
                <h2 className="zone-title">Zonas</h2>
                <button
                    onClick={() => navigate(`/restaurants/${activeRestaurant.restaurant_id}/zones/new`)}
                    className="zone-new-button"
                >
                    Nueva Zona
                </button>
            </div>

            {error && (
                <div className="zone-error">
                    {error}
                </div>
            )}

            {zones.length === 0 ? (
                <div className="zone-empty">
                    <p>No hay zonas disponibles</p>
                    <button
                        onClick={() => navigate(`/restaurants/${activeRestaurant.restaurant_id}/zones/new`)}
                        className="zone-new-button"
                    >
                        Crear la primera zona
                    </button>
                </div>
            ) : (
                <div className="zone-grid">
                    {zones.map((zone) => (
                        <div key={zone.zone_id} className="zone-card">
                            <h3 className="zone-name">{zone.zone_name}</h3>
                            <div className="zone-info">
                                <p>Capacidad: {zone.zone_capacity} personas</p>
                            </div>
                            <div className="zone-actions">
                                <button
                                    onClick={() => navigate(`/restaurants/${activeRestaurant.restaurant_id}/zones/${zone.zone_id}/tables`)}
                                    className="zone-action-button zone-action-primary"
                                >
                                    Mesas
                                </button>
                                <button
                                    onClick={() => navigate(`/restaurants/${activeRestaurant.restaurant_id}/zones/${zone.zone_id}/edit`)}
                                    className="zone-action-button zone-action-secondary"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ZoneList;
