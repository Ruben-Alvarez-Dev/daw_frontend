import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import Button from '../../common/Button/Button';
import UserSearchDropdown from '../../common/UserSearchDropdown/UserSearchDropdown';

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
            const date = new Date(reservation.date);
            setFormData({
                user_id: reservation.user_id,
                guests: reservation.guests,
                date: date.toISOString().split('T')[0],
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
                setError(err.message);
            }
        };

        fetchUsers();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validar que la hora coincide con el turno
        const time = formData.time;
        const isLunchTime = formData.shift === 'lunch' && time >= '12:00' && time <= '16:00';
        const isDinnerTime = formData.shift === 'dinner' && time >= '20:00' && time <= '23:59';

        if (!isLunchTime && !isDinnerTime) {
            setError('La hora debe coincidir con el turno seleccionado:\n- Comida: 12:00-16:00\n- Cena: 20:00-23:59');
            return;
        }

        try {
            const url = isEditing 
                ? `${import.meta.env.VITE_API_URL}/api/reservations/${reservation.id}`
                : `${import.meta.env.VITE_API_URL}/api/reservations`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    user_id: formData.user_id,
                    guests: parseInt(formData.guests),
                    date: formData.date,
                    time: formData.time,
                    shift: formData.shift,
                    status: formData.status
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || (isEditing ? 'Error al actualizar la reserva' : 'Error al crear la reserva'));
            }

            onSave();
            setFormData(initialFormData);
            setReset(true);
        } catch (err) {
            console.error('Error submitting reservation:', err);
            setError(err.message);
        }
    };

    const handleReset = () => {
        setFormData(initialFormData);
        setReset(true);
        onReset();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Si se cambia el turno, resetear la hora para evitar valores inválidos
        if (name === 'shift') {
            setFormData(prev => ({
                ...prev,
                [name]: value,
                time: '' // Reset time when shift changes
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setReset(false);
    };

    if (error) {
        return <div className="form-error">{error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
                <label htmlFor="user_id">Usuario</label>
                <UserSearchDropdown
                    users={users}
                    value={formData.user_id}
                    onChange={(value) => {
                        setReset(false);
                        setFormData(prev => ({ ...prev, user_id: value }));
                    }}
                    placeholder="Buscar usuario por nombre, email o teléfono..."
                    disabled={readOnly}
                    reset={reset}
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">Fecha</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-control"
                    disabled={readOnly}
                />
            </div>

            <div className="form-group">
                <label htmlFor="shift">Turno</label>
                <select
                    id="shift"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    required
                    className="form-control"
                    disabled={readOnly}
                >
                    <option value="">Selecciona un turno</option>
                    <option value="lunch">Comida (12:00-16:00)</option>
                    <option value="dinner">Cena (20:00-23:59)</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="time">Hora</label>
                <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-control"
                    disabled={readOnly}
                    min={formData.shift === 'lunch' ? '12:00' : '20:00'}
                    max={formData.shift === 'lunch' ? '16:00' : '23:59'}
                />
            </div>

            <div className="form-group">
                <label htmlFor="guests">Número de comensales</label>
                <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="form-control"
                    disabled={readOnly}
                />
            </div>

            <div className="form-group">
                <label htmlFor="status">Estado</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="form-control"
                    disabled={readOnly}
                >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                    <option value="seated">Sentados</option>
                    <option value="no-show">No presentados</option>
                </select>
            </div>

            <div className="form-actions">
                {!readOnly && (
                    <Button type="submit" variant="primary">
                        {isEditing ? 'Actualizar' : 'Crear'}
                    </Button>
                )}
                {isEditing && (
                    <Button type="button" onClick={onCancel} variant="secondary">
                        Cancelar
                    </Button>
                )}
                {!readOnly && (
                    <Button type="button" onClick={handleReset} variant="secondary">
                        Resetear
                    </Button>
                )}
            </div>
        </form>
    );
}

AdminReservationForm.propTypes = {
    reservation: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool
};
