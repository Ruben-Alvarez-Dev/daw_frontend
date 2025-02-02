import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import List from '../../common/List/List';
import Card from '../../common/Card/Card';
import './AdminUserList.css';

export default function AdminUserList({ onEdit, onDelete }) {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            setFilteredUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        if (!term.trim()) {
            setFilteredUsers(users);
            return;
        }

        const searchTerm = term.toLowerCase();
        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.phone && user.phone.includes(searchTerm))
        );
        setFilteredUsers(filtered);
    };

    const renderContent = (user) => (
        <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-details">
                <span>{user.email}</span>
                <span>{user.phone || 'Sin teléfono'}</span>
            </div>
        </div>
    );

    const renderIds = (user) => (
        <div className="user-meta">
            <span className={`user-role role-${user.role}`}>
                {user.role === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
            <span className="user-id">#{user.id}</span>
        </div>
    );

    return (
        
            <List
                items={filteredUsers}
                renderContent={renderContent}
                renderIds={renderIds}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
                error={error}
                searchPlaceholder="Buscar por nombre, email o teléfono..."
                onSearch={handleSearch}
                emptyMessage="No hay usuarios registrados"
            />
        
    );
}
