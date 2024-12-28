import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getTables } from '../../../services/api';
import './TableList.css';

const TableList = () => {
    const { restaurantId, zoneId } = useParams();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { activeRestaurant } = useApp();

    useEffect(() => {
        const fetchTables = async () => {
            if (!restaurantId || !zoneId) return;
            
            try {
                const data = await getTables(getToken(), restaurantId, zoneId);
                setTables(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las mesas');
                setLoading(false);
            }
        };

        fetchTables();
    }, [getToken, restaurantId, zoneId]);

    if (loading) return <div className="table-loading">Cargando...</div>;

    const getTableStatusClass = (status) => {
        switch (status) {
            case 'occupied':
                return 'table-status-occupied';
            case 'reserved':
                return 'table-status-reserved';
            default:
                return 'table-status-available';
        }
    };

    return (
        <div className="table-list">
            <div className="table-header">
                <h2 className="table-title">Mesas</h2>
                <button
                    onClick={() => navigate(`/restaurants/${restaurantId}/zones/${zoneId}/tables/new`)}
                    className="table-new-button"
                >
                    Nueva Mesa
                </button>
            </div>

            {error && (
                <div className="table-error">
                    {error}
                </div>
            )}

            {tables.length === 0 ? (
                <div className="table-empty">
                    <p>No hay mesas disponibles</p>
                    <button
                        onClick={() => navigate(`/restaurants/${restaurantId}/zones/${zoneId}/tables/new`)}
                        className="table-new-button"
                    >
                        Crear la primera mesa
                    </button>
                </div>
            ) : (
                <div className="table-grid">
                    {tables.map((table) => (
                        <div key={table.table_id} className={`table-card ${getTableStatusClass(table.status)}`}>
                            <h3 className="table-name">Mesa {table.table_number}</h3>
                            <div className="table-info">
                                <p>Capacidad: {table.capacity} personas</p>
                                <p>Estado: {table.status}</p>
                            </div>
                            <div className="table-actions">
                                <button
                                    onClick={() => navigate(`/restaurants/${restaurantId}/zones/${zoneId}/tables/${table.table_id}/reservations`)}
                                    className="table-action-button table-action-primary"
                                >
                                    Reservas
                                </button>
                                <button
                                    onClick={() => navigate(`/restaurants/${restaurantId}/zones/${zoneId}/tables/${table.table_id}/edit`)}
                                    className="table-action-button table-action-secondary"
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

export default TableList;
