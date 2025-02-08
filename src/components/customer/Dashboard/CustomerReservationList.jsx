import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import './CustomerReservationList.css';

export default function CustomerReservationList({ refreshTrigger, token, onReservationsLoaded }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('http://localhost:8000/api/my-reservations', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar las reservas');
                }

                const data = await response.json();
                setReservations(data);
                onReservationsLoaded(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [refreshTrigger, token, onReservationsLoaded]);

    const handleCancel = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'cancelled'
                })
            });

            if (!response.ok) {
                throw new Error('Error al cancelar la reserva');
            }

            // Actualizar la lista de reservas
            setReservations(prev => 
                prev.map(res => 
                    res.id === id ? { ...res, status: 'cancelled' } : res
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="loading">Cargando reservas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="customer-reservation-list">
            {reservations.length === 0 ? (
                <div className="no-reservations">No tienes reservas activas</div>
            ) : (
                <div className="reservations-grid">
                    {reservations.map(reservation => (
                        <div key={reservation.id} className="reservation-card">
                            <div className="reservation-header">
                                <span className={`status status-${reservation.status}`}>
                                    {reservation.status === 'pending' && 'Pendiente'}
                                    {reservation.status === 'confirmed' && 'Confirmada'}
                                    {reservation.status === 'cancelled' && 'Cancelada'}
                                    {reservation.status === 'seated' && 'Sentados'}
                                    {reservation.status === 'no-show' && 'No presentado'}
                                </span>
                            </div>
                            <div className="reservation-body">
                                <div className="reservation-info">
                                    <p><strong>Fecha:</strong> {new Date(reservation.date).toLocaleDateString()}</p>
                                    <p><strong>Hora:</strong> {reservation.time}</p>
                                    <p><strong>Personas:</strong> {reservation.guests}</p>
                                    <p><strong>Turno:</strong> {reservation.shift === 'lunch' ? 'Comida' : 'Cena'}</p>
                                </div>
                                {reservation.status === 'pending' && (
                                    <Button
                                        variant="danger"
                                        label="Cancelar"
                                        onClick={() => handleCancel(reservation.id)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
