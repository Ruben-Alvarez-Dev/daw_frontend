import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import Button from '../../common/Button/Button';
import UserSearchDropdown from '../../common/UserSearchDropdown/UserSearchDropdown';

export default function AdminReservationForm({ reservation, onSave, onCancel, onReset, isEditing, readOnly }) {
    const [users, setUsers] = useState([]);
    const [tables, setTables] = useState([]);
    const [reset, setReset] = useState(false);
    const initialFormData = {
        user_id: '',
        table_id: '',
        guests: '',
        datetime: '',
        status: 'pending'
    };
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (reservation) {
            setFormData({
                user_id: reservation.user_id,
                table_id: reservation.table_id || '',
                guests: reservation.guests,
                datetime: new Date(reservation.datetime).toISOString().slice(0, 16),
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

        const fetchTables = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error al cargar mesas');
                const data = await response.json();
                setTables(data);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setError(err.message);
            }
        };

        fetchUsers();
        fetchTables();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

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
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(isEditing ? 'Error al actualizar la reserva' : 'Error al crear la reserva');
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
        setReset(false);
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                <label htmlFor="table_id">Mesa</label>
                <select
                    id="table_id"
                    name="table_id"
                    value={formData.table_id}
                    onChange={handleChange}
                    className="form-control"
                    disabled={readOnly}
                >
                    <option value="">Seleccionar mesa</option>
                    {tables.map(table => (
                        <option key={table.id} value={table.id}>
                            {table.name} (Capacidad: {table.capacity})
                        </option>
                    ))}
                </select>
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
                <label htmlFor="datetime">Fecha y hora</label>
                <input
                    type="datetime-local"
                    id="datetime"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    required
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
                    <option value="completed">Completada</option>
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
