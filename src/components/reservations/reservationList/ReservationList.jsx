import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getReservations } from '../../../services/api';
import './ReservationList.css';

const ReservationList = () => {
    const { restaurantId, tableId } = useParams();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getReservations(getToken(), restaurantId, tableId);
                setReservations(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar las reservas');
                setLoading(false);
            }
        };

        fetchReservations();
    }, [getToken, restaurantId, tableId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
    };

    if (loading) return <div className="reservation-loading">Cargando...</div>;

    return (
        <div className="reservation-list">
            <div className="reservation-header">
                <h2 className="reservation-title">Reservas</h2>
                <button
                    onClick={() => navigate(`/restaurants/${restaurantId}/tables/${tableId}/reservations/new`)}
                    className="reservation-new-button"
                >
                    Nueva Reserva
                </button>
            </div>

            {error && (
                <div className="reservation-error">
                    {error}
                </div>
            )}

            {reservations.length === 0 ? (
                <div className="reservation-empty">
                    <p>No hay reservas programadas</p>
                    <button
                        onClick={() => navigate(`/restaurants/${restaurantId}/tables/${tableId}/reservations/new`)}
                        className="reservation-new-button"
                    >
                        Crear la primera reserva
                    </button>
                </div>
            ) : (
                <div className="reservation-grid">
                    {reservations.map((reservation) => (
                        <div key={reservation.reservation_id} className="reservation-card">
                            <h3 className="reservation-name">
                                {reservation.customer_name}
                            </h3>
                            <div className="reservation-info">
                                <p>Fecha: {formatDate(reservation.reservation_date)}</p>
                                <p>Personas: {reservation.number_of_people}</p>
                                <p>Estado: {reservation.status}</p>
                                {reservation.notes && (
                                    <p>Notas: {reservation.notes}</p>
                                )}
                            </div>
                            <div className="reservation-actions">
                                <button
                                    onClick={() => navigate(`/restaurants/${restaurantId}/tables/${tableId}/reservations/${reservation.reservation_id}/edit`)}
                                    className="reservation-action-button reservation-action-secondary"
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

export default ReservationList;
