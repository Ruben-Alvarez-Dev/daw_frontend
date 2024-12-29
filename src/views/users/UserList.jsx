import { useState, useEffect } from 'react';
import { getUsers } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers(token);
                setUsers(data);
            } catch (err) {
                setError('Error al cargar los usuarios');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    if (loading) return <div>Cargando usuarios...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-list">
            <h1 className="user-list-title">Usuarios</h1>
            <div className="user-list-content">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="button button-secondary">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
