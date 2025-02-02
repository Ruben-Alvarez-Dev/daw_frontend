import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import List from '../../common/List/List';
import './AdminReservationList.css';

export default function AdminReservationList({ onEdit, onDelete }) {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [users, setUsers] = useState({});
    const [tables, setTables] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Cargar usuarios y crear un mapa para acceso rápido
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
                const usersMap = {};
                data.forEach(user => {
                    usersMap[user.id] = user;
                });
                setUsers(usersMap);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Error al cargar usuarios');
            }
        };
        fetchUsers();
    }, [token]);

    // Cargar mesas y crear un mapa para acceso rápido
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
                const tablesMap = {};
                data.forEach(table => {
                    tablesMap[table.id] = table;
                });
                setTables(tablesMap);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setError('Error al cargar mesas');
            }
        };
        fetchTables();
    }, [token]);

    // Cargar reservas
    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Error cargando reservas');
                const data = await response.json();
                // Ordenar por fecha y mostrar solo las 5 más recientes
                const sortedReservations = data.sort((a, b) => 
                    new Date(b.datetime) - new Date(a.datetime)
                ).slice(0, 5);
                setReservations(sortedReservations);
            } catch (err) {
                console.error('Error fetching reservations:', err);
                setError('Error al cargar reservas');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, [token]);

    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleDelete = async (reservation) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${reservation.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error eliminando reserva');
            
            setReservations(prev => prev.filter(item => item.id !== reservation.id));
            onDelete && onDelete(reservation.id);
        } catch (err) {
            console.error('Error deleting reservation:', err);
            setError('Error al eliminar la reserva');
        }
    };

    const renderItem = (reservation) => {
        const user = users[reservation.user_id] || {};
        const table = tables[reservation.table_id] || {};
        
        return (
            <>
                <div className="item-header">
                    <span>#{reservation.id}</span>
                    <span className={`status-badge status-${reservation.status}`}>
                        {reservation.status}
                    </span>
                </div>
                <div className="item-details">
                    <div><strong>Usuario:</strong> {user.name} ({user.email})</div>
                    <div><strong>Mesa:</strong> {table.name} (Cap: {table.capacity})</div>
                    <div><strong>Comensales:</strong> {reservation.guests}</div>
                    <div><strong>Fecha y Hora:</strong> {formatDateTime(reservation.datetime)}</div>
                </div>
            </>
        );
    };

    return (
        <div className="list-container">
            <List
                items={reservations}
                renderItem={renderItem}
                onEdit={onEdit}
                onDelete={handleDelete}
                loading={loading}
                error={error}
                emptyMessage="No hay reservas disponibles"
            />
        </div>
    );
}
