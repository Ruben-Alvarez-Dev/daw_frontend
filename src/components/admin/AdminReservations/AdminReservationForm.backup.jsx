import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import Button from '../../common/Button/Button';
import UserSearchDropdown from '../../common/UserSearchDropdown/UserSearchDropdown';
import ReservationDateTime from '../../reservations/ReservationDateTime';
import './AdminReservationForm.css';

export default function AdminReservationForm({ reservation, onSave, onCancel, onReset, isEditing, readOnly }) {
    const [users, setUsers] = useState([]);
    const [reset, setReset] = useState(false);
    const initialFormData = {
        user_id: '',
        guests: '',
        date: '',
        time: '',
        shift: '',
        status: 'pending'
    };
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (reservation) {
            setFormData({
                user_id: reservation.user_id,
                guests: reservation.guests,
                date: reservation.date,
                time: reservation.time,
                shift: reservation.shift,
                status: reservation.status
            });
            setReset(false);
        } else {
            setFormData(initialFormData);
            setReset(true);
        }
    }, [reservation]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error al cargar usuarios');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Error al cargar usuarios');
            }
        };

        fetchUsers();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (!formData.user_id) {
                setError('Por favor, selecciona un usuario');
                return;
            }

            if (!formData.guests) {
                setError('Por favor, indica el número de comensales');
                return;
            }

            if (!formData.date || !formData.time || !formData.shift) {
                setError('Por favor, selecciona fecha, turno y hora');
                return;
            }

            console.log('Submitting form data:', formData);
            const response = await onSave(formData);
            console.log('Save response:', response);

            if (response && response.error) {
                setError(response.error);
                return;
            }

            setFormData(initialFormData);
        } catch (err) {
            console.error('Error saving reservation:', err);
            setError(err.message || 'Error al guardar la reserva');
        }
    };

    const handleDateTimeChange = (dateTimeData) => {
        console.log('DateTime changed:', dateTimeData);
        setFormData(prev => ({
            ...prev,
            date: dateTimeData.date,
            time: dateTimeData.time,
            shift: dateTimeData.shift
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) || '' : value
        }));
    };

    const handleUserSelect = (userId) => {
        console.log('User selected:', userId);
        setFormData(prev => ({
            ...prev,
            user_id: userId
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="admin-reservation-form">
            <div className="form-row">
                <div className="form-field">
                    <label>Usuario</label>
                    <UserSearchDropdown
                        users={users}
                        value={formData.user_id}
                        onChange={handleUserSelect}
                        placeholder="Buscar usuario..."
                        disabled={readOnly}
                    />
                </div>

                <div className="form-field">
                    <label>Comensales</label>
                    <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        min="1"
                        disabled={readOnly}
                    />
                </div>
            </div>

            <ReservationDateTime 
                onDateTimeChange={handleDateTimeChange}
                initialDate={formData.date}
                initialTime={formData.time}
                initialShift={formData.shift}
                disabled={readOnly}
            />

            <div className="form-row">
                <div className="form-field">
                    <label>Estado</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        disabled={readOnly}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="cancelled">Cancelada</option>
                        <option value="completed">Completada</option>
                        <option value="no-show">No presentado</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                {!readOnly && (
                    <>
                        <Button type="submit" variant="primary">
                            {isEditing ? 'Guardar cambios' : 'Crear reserva'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={onCancel}>
                            Cancelar
                        </Button>
                        {onReset && (
                            <Button type="button" variant="secondary" onClick={onReset}>
                                Resetear
                            </Button>
                        )}
                    </>
                )}
            </div>
        </form>
    );
}

AdminReservationForm.propTypes = {
    reservation: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onReset: PropTypes.func,
    isEditing: PropTypes.bool,
    readOnly: PropTypes.bool
};
