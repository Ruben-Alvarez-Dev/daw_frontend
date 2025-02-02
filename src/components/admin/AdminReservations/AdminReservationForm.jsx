import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';
import './AdminReservationForm.css';

export default function AdminReservationForm({ reservation, onSave, onCancel }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [tables, setTables] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        user_id: '',
        table_id: '',
        guests: '',
        datetime: '',
        status: 'pending'
    });

    // Cargar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error cargando usuarios');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Error al cargar usuarios');
            }
        };
        fetchUsers();
    }, [token]);

    // Cargar mesas
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error cargando mesas');
                const data = await response.json();
                setTables(data);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setError('Error al cargar mesas');
            }
        };
        fetchTables();
    }, [token]);

    useEffect(() => {
        if (reservation) {
            // Convertir datetime a formato local para el input
            const localDateTime = new Date(reservation.datetime)
                .toISOString()
                .slice(0, 16); // Formato YYYY-MM-DDTHH:mm

            setFormData({
                ...reservation,
                datetime: localDateTime
            });
        } else {
            setFormData({
                id: '',
                user_id: '',
                table_id: '',
                guests: '',
                datetime: '',
                status: 'pending'
            });
        }
    }, [reservation]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/reservations${reservation ? `/${reservation.id}` : ''}`;
            const method = reservation ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            onSave(data);
            setFormData({
                id: '',
                user_id: '',
                table_id: '',
                guests: '',
                datetime: '',
                status: 'pending'
            });
        } catch (err) {
            console.error('Error saving reservation:', err);
            setError('Error al guardar la reserva: ' + err.message);
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

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            {error && <div className="error-message">{error}</div>}
            
            {reservation && (
                <div className="form-group">
                    <input
                        type="text"
                        value={`ID: ${formData.id}`}
                        disabled
                        className="form-control"
                    />
                </div>
            )}

            <div className="form-group">
                <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    required
                    className="form-control"
                >
                    <option value="">Seleccionar Usuario</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <select
                    name="table_id"
                    value={formData.table_id}
                    onChange={handleChange}
                    required
                    className="form-control"
                >
                    <option value="">Seleccionar Mesa</option>
                    {tables.map(table => (
                        <option key={table.id} value={table.id}>
                            Mesa {table.name} (Capacidad: {table.capacity})
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="Número de Comensales"
                    required
                    min="1"
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <input
                    type="datetime-local"
                    name="datetime"
                    value={formData.datetime}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="form-control"
                >
                    <option value="pending">Pendiente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                    <option value="seated">Sentados</option>
                    <option value="no-show">No presentado</option>
                </select>
            </div>

            <div className="form-actions">
                <Button
                    type="submit"
                    variant="primary"
                    label={reservation ? "Actualizar" : "Crear"}
                    disabled={loading}
                />
                <Button
                    type="button"
                    variant="secondary"
                    label="Cancelar"
                    onClick={onCancel}
                    disabled={loading}
                />
            </div>
        </form>
    );
}
