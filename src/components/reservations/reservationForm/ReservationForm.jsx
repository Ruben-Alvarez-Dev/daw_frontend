import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getReservation, createReservation, updateReservation } from '../../../services/api';
import './ReservationForm.css';

const ReservationForm = () => {
    const { restaurantId, tableId, reservationId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        number_of_people: '',
        notes: '',
        status: 'pending',
        table_id: tableId
    });

    useEffect(() => {
        if (reservationId) {
            const fetchReservation = async () => {
                try {
                    const data = await getReservation(getToken(), restaurantId, tableId, reservationId);
                    // Format date for datetime-local input
                    const date = new Date(data.reservation_date);
                    data.reservation_date = date.toISOString().slice(0, 16);
                    setFormData(data);
                } catch (err) {
                    setError('Error al cargar la reserva');
                }
            };
            fetchReservation();
        }
    }, [getToken, restaurantId, tableId, reservationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (reservationId) {
                await updateReservation(getToken(), restaurantId, tableId, reservationId, formData);
            } else {
                await createReservation(getToken(), restaurantId, tableId, formData);
            }
            navigate(`/restaurants/${restaurantId}/tables/${tableId}/reservations`);
        } catch (err) {
            setError('Error al guardar la reserva');
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

    if (loading) return <div className="reservation-form-loading">Guardando...</div>;

    return (
        <div className="reservation-form-container">
            <div className="reservation-form-card">
                <h2 className="reservation-form-title">
                    {reservationId ? 'Editar Reserva' : 'Nueva Reserva'}
                </h2>
                
                {error && (
                    <div className="reservation-form-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="reservation-form">
                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Nombre del Cliente</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        />
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Email del Cliente</label>
                        <input
                            type="email"
                            name="customer_email"
                            value={formData.customer_email}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        />
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Teléfono del Cliente</label>
                        <input
                            type="tel"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        />
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Fecha y Hora</label>
                        <input
                            type="datetime-local"
                            name="reservation_date"
                            value={formData.reservation_date}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        />
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Número de Personas</label>
                        <input
                            type="number"
                            name="number_of_people"
                            value={formData.number_of_people}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        />
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="reservation-form-input"
                            required
                        >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="cancelled">Cancelada</option>
                        </select>
                    </div>

                    <div className="reservation-form-group">
                        <label className="reservation-form-label">Notas</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="reservation-form-input"
                            rows="3"
                        />
                    </div>

                    <div className="reservation-form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(`/restaurants/${restaurantId}/tables/${tableId}/reservations`)}
                            className="reservation-form-button reservation-form-button-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="reservation-form-button reservation-form-button-primary"
                            disabled={loading}
                        >
                            {reservationId ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationForm;
