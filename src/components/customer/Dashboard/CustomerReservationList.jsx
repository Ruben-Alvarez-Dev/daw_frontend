import { useEffect, useState } from 'react';
import Button from '../../../components/common/Button/Button';
import './CustomerReservationList.css';

export default function CustomerReservationList({ refreshTrigger, token, onReservationsLoaded }) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('active'); // Por defecto mostramos reservas en vigor

    const filterReservations = (reservations, filterType) => {
        const now = new Date();
        
        switch(filterType) {
            case 'active':
                return reservations.filter(res => {
                    // Solo necesitamos verificar que la fecha sea de hoy o posterior
                    // y que el estado sea válido
                    const resDate = new Date(res.date);
                    const isValidDate = resDate >= new Date().setHours(0,0,0,0);
                    const isValidStatus = ['pending', 'confirmed'].includes(res.status);

                    console.log({
                        reserva: res.date,
                        hora: res.time,
                        estado: res.status,
                        esValidaFecha: isValidDate,
                        esValidoEstado: isValidStatus
                    });

                    return isValidDate && isValidStatus;
                });
                
            case 'historic':
                return reservations.filter(res => 
                    res.status !== 'cancelled'
                );
                
            case 'all':
            default:
                return reservations;
        }
    };

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError(null);
            setCancelError(null);

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
            setCancelError(null);
            console.log('Cancelling reservation:', id);
            
            const reservation = reservations.find(r => r.id === id);
            if (!reservation) {
                throw new Error('Reserva no encontrada');
            }

            const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...reservation,
                    status: 'cancelled'
                })
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Error al cancelar la reserva');
            }

            const updatedResponse = await fetch('http://localhost:8000/api/my-reservations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!updatedResponse.ok) {
                throw new Error('Error al actualizar la lista de reservas');
            }

            const updatedData = await updatedResponse.json();
            setReservations(updatedData);
            onReservationsLoaded(updatedData);
            setCancelError(null);
        } catch (err) {
            console.error('Error details:', err);
            setCancelError(err.message);
        }
    };

    if (loading) return <div className="loading">Cargando reservas...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const filteredReservations = filterReservations(reservations, activeFilter);

    return (
        <div className="customer-reservation-list">
            <div className="filter-buttons">
                <Button
                    variant={activeFilter === 'active' ? 'primary' : 'secondary'}
                    size="small"
                    label="En vigor"
                    onClick={() => setActiveFilter('active')}
                />
                <Button
                    variant={activeFilter === 'historic' ? 'primary' : 'secondary'}
                    size="small"
                    label="Histórico"
                    onClick={() => setActiveFilter('historic')}
                />
                <Button
                    variant={activeFilter === 'all' ? 'primary' : 'secondary'}
                    size="small"
                    label="Todas"
                    onClick={() => setActiveFilter('all')}
                />
            </div>

            {cancelError && (
                <div className="error-message error-message--cancel">
                    {cancelError}
                </div>
            )}
            
            {filteredReservations.length === 0 ? (
                <div className="no-reservations">No hay reservas que mostrar</div>
            ) : (
                <div className="reservations-grid">
                    {filteredReservations.map(reservation => (
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
