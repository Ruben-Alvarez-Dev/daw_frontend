import { useState, useEffect } from 'react';
import Card from '../../common/Card/Card';
import './UserList.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

const UserList = ({ id }) => {
    const { token } = useAuth();
    const { userActive, setUserActive, clearUserActive } = useApp();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, [userActive]); // Recargar cuando cambie userActive

    const loadUsers = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }

            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Error al cargar la lista de usuarios');
        }
    };

    const handleUserClick = (user) => {
        if (userActive?.id === user.id) {
            clearUserActive();
        } else {
            setUserActive(user);
        }
    };

    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar usuario');
                }

                // Si el usuario eliminado era el activo, lo limpiamos
                if (userActive?.id === userId) {
                    clearUserActive();
                }
                
                // Recargar la lista de usuarios
                loadUsers();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleNewUser = () => {
        clearUserActive();
    };

    const renderUserItem = (user) => {
        return (
            <div 
                key={user.id}
                className={`user-item ${userActive?.id === user.id ? 'active' : ''}`}
                onClick={() => handleUserClick(user)}
            >
                <div className="user-header">
                    <span>ID: {user.id}</span>
                    <button
                        className="delete-button"
                        onClick={(e) => handleDeleteUser(user.id, e)}
                    >
                        Eliminar
                    </button>
                </div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <div className="user-role">Rol: {user.role}</div>
                <div className="user-phone">Teléfono: {user.phone || 'No especificado'}</div>
                <div className="user-visits">Visitas: {user.visits || 0}</div>
            </div>
        );
    };

    return (
        <Card
            id={id}
            header={<h2>Lista de Usuarios</h2>}
            body={
                <div className="user-list">
                    {error && <div className="error">{error}</div>}
                    <div className="list-container">
                        {users.map(renderUserItem)}
                    </div>
                </div>
            }
            footer={
                <div className="list-actions">
                    <button 
                        className="new-user-button"
                        onClick={handleNewUser}
                    >
                        Añadir Usuario
                    </button>
                </div>
            }
        />
    );
};

UserList.propTypes = {
    id: PropTypes.string.isRequired
};

export default UserList;
