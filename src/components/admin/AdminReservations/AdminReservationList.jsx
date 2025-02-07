import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import Button from '../../common/Button/Button';
import ListItemSearchbar from '../../common/List/ListItemSearchbar';
import './AdminReservationList.css';

export default function AdminReservationList({ 
    onEdit, 
    onDelete, 
    refresh,
    reservations,
    setReservations,
    selectedReservation,
    onSelect,
    onFilteredCountChange 
}) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            setIsLoading(true);
            setError(null);
            setSearchTerm(''); // Reset search term on refresh
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las reservas');
                }

                const data = await response.json();
                setReservations(data);
            } catch (err) {
                console.error('Error fetching reservations:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, [token, refresh, setReservations]);

    const filteredReservations = reservations.filter(reservation => {
        const searchString = searchTerm.toLowerCase();
        return (
            reservation.id.toString().includes(searchString) ||
            (reservation.user?.name || '').toLowerCase().includes(searchString) ||
            reservation.status.toLowerCase().includes(searchString)
        );
    });

    useEffect(() => {
        onFilteredCountChange(filteredReservations.length);
    }, [filteredReservations.length, onFilteredCountChange]);

    if (error) {
        return <div className="reservation-list-message error">{error}</div>;
    }

    if (isLoading) {
        return <div className="reservation-list-message">Cargando reservas...</div>;
    }

    return (
        <div className="reservation-list">
            <ListItemSearchbar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por ID, usuario o estado..."
            />
            <div className="reservation-list-content">
                {filteredReservations.length === 0 ? (
                    <div className="reservation-list-message">No se encontraron reservas</div>
                ) : (
                    filteredReservations.map(reservation => (
                        <div 
                            key={reservation.id}
                            className={`reservation-list-item ${selectedReservation?.id === reservation.id ? 'selected' : ''}`}
                            onClick={() => onSelect(reservation)}
                        >
                            <div className="reservation-info">
                                <div className="reservation-header">
                                    <span className="reservation-id">#{reservation.id}</span>
                                    <span className={`reservation-status status-${reservation.status.toLowerCase()}`}>
                                        {reservation.status}
                                    </span>
                                </div>
                                <div className="reservation-details">
                                    <div>Usuario: {reservation.user?.name || 'N/A'}</div>
                                    <div>Comensales: {reservation.guests}</div>
                                    <div>Fecha: {reservation.date && reservation.time ? 
                                        `${new Date(reservation.date).toLocaleDateString('es-ES')} ${reservation.time}` : 
                                        'Fecha y hora no disponibles'
                                    }</div>
                                </div>
                            </div>
                            <div className="reservation-actions">
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(reservation);
                                }} variant="primary">
                                    Editar
                                </Button>
                                <Button onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(reservation);
                                }} variant="danger">
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

AdminReservationList.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    refresh: PropTypes.number.isRequired,
    reservations: PropTypes.array.isRequired,
    setReservations: PropTypes.func.isRequired,
    selectedReservation: PropTypes.object,
    onSelect: PropTypes.func.isRequired,
    onFilteredCountChange: PropTypes.func.isRequired
};
