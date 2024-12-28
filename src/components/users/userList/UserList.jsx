import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getUsers } from '../../../services/api';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(getToken());
                setUsers(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los usuarios');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [getToken]);

    if (loading) return <div className="user-loading">Cargando...</div>;

    return (
        <div className="user-list">
            <div className="user-header">
                <h2 className="user-title">Usuarios</h2>
                <button
                    onClick={() => navigate('/users/new')}
                    className="user-new-button"
                >
                    Nuevo Usuario
                </button>
            </div>

            {error && (
                <div className="user-error">
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <div className="user-empty">
                    <p>No hay usuarios registrados</p>
                    <button
                        onClick={() => navigate('/users/new')}
                        className="user-new-button"
                    >
                        Crear el primer usuario
                    </button>
                </div>
            ) : (
                <div className="user-grid">
                    {users.map((user) => (
                        <div key={user.user_id} className="user-card">
                            <h3 className="user-name">{user.name}</h3>
                            <div className="user-info">
                                <p>Email: {user.email}</p>
                                <p>Rol: {user.role}</p>
                            </div>
                            <div className="user-actions">
                                <button
                                    onClick={() => navigate(`/users/${user.user_id}/edit`)}
                                    className="user-action-button user-action-secondary"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;
