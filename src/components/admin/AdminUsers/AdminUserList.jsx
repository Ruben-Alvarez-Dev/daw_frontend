import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AdminUserList.css';

export default function AdminUserList({ onEdit, onDelete }) {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
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
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return user.name.toLowerCase().includes(term) ||
               user.email.toLowerCase().includes(term) ||
               (user.phone && user.phone.includes(term));
    });

    if (loading) return <div className="user-list-message">Cargando usuarios...</div>;
    if (error) return <div className="user-list-message error">{error}</div>;
    if (!users.length) return <div className="user-list-message">No hay usuarios registrados</div>;

    return (
        <div className="user-list">
            <div className="user-list-search">
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="user-list-items">
                {filteredUsers.map(user => (
                    <div key={user.id} className="user-list-item">
                        <div className="user-info">
                            <div className="user-name">{user.name}</div>
                            <div className="user-details">
                                <span>{user.email}</span>
                                <span>{user.phone || 'Sin teléfono'}</span>
                            </div>
                        </div>
                        <div className="user-meta">
                            <span className={`user-role role-${user.role}`}>
                                {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                            </span>
                            <div className="user-actions">
                                <button onClick={() => onEdit(user)} className="action-button">
                                    Editar
                                </button>
                                <button onClick={() => onDelete(user)} className="action-button delete">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
