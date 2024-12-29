import { useState, useEffect } from 'react';
import Card from '../../common/Card/Card';
import './UserList.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../../context/AuthContext';
import { getUsers } from '../../../services/api';

const UserList = ({ id, isActive, onActivate, onSelectUser, onAddUser, refreshTrigger }) => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Cargar usuarios cuando cambie el token o refreshTrigger
    useEffect(() => {
        console.log('UserList - Token actual:', token);
        if (token) {
            loadUsers();
        } else {
            console.log('UserList - No hay token disponible');
            setError('No hay token de autenticación disponible');
        }
    }, [token, refreshTrigger]);

    const loadUsers = async () => {
        try {
            console.log('UserList - Iniciando carga de usuarios');
            setLoading(true);
            setError(null);

            const data = await getUsers(token);
            console.log('UserList - Datos recibidos:', data);
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('UserList - Error al cargar usuarios:', error);
            setError(error.message || 'Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Respuesta del servidor:', response);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error del servidor:', errorData);
                    throw new Error(errorData.message || 'Error al eliminar usuario');
                }

                await loadUsers();
                if (selectedUserId === userId) {
                    setSelectedUserId(null);
                    onSelectUser(null);
                }
            } catch (err) {
                console.error('Error detallado:', err);
                alert('Error al eliminar el usuario');
            }
        }
    };

    return (
        <Card
            id={id}
            header={<h2>Lista de Usuarios</h2>}
            body={
                <div className="user-list-container">
                    {loading && <p>Cargando usuarios...</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && !error && users.length === 0 && (
                        <p>No hay usuarios para mostrar</p>
                    )}
                    {!loading && !error && users.length > 0 && (
                        <div className="users-grid">
                            {users.map(user => (
                                <div 
                                    className={`user-item ${selectedUserId === user.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        onSelectUser(user);
                                    }}
                                    key={user.id}
                                >
                                    <div className="user-name">{user.name}</div>
                                    <div className="user-email">{user.email}</div>
                                    <div className="user-role">Rol: {user.role}</div>
                                    <button 
                                        className="delete-button"
                                        onClick={(e) => handleDeleteUser(user.id, e)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
            footer={
                <button 
                    className="add-user-btn"
                    onClick={() => {
                        setSelectedUserId(null);
                        onSelectUser(null);
                        onAddUser(); // Llamamos a la nueva función
                    }}
                >
                    Añadir Usuario
                </button>
            }
            isActive={isActive}
            onActivate={onActivate}
        />
    );
};

UserList.propTypes = {
    id: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onActivate: PropTypes.func.isRequired,
    onSelectUser: PropTypes.func.isRequired,
    onAddUser: PropTypes.func.isRequired,
    refreshTrigger: PropTypes.any // Puede ser cualquier valor que cambie para forzar la actualización
};

export default UserList;
