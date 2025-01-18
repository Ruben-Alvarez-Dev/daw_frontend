import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminUserList.css';

const AdminUserList = forwardRef(({ onEdit }, ref) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
      }

      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error fetching users:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchUsers
  }));

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el usuario');
      }

      fetchUsers();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <ul className="admin-users-list">
        {users.map(user => (
          <li key={user.id} className="user-item">
            <div className="user-line">
              <span className="user-field">ID: {user.id}</span>
              <span className="user-field">Nombre: {user.name}</span>
            </div>
            <div className="user-line">
              <span className="user-field">Email: {user.email}</span>
              <span className="user-field">Teléfono: {user.phone}</span>
            </div>
            <div className="user-line">
              <span className="user-field">Rol: {user.role === 'admin' ? 'Administrador' : 'Cliente'}</span>
              <div className="button-group">
                <button className="edit-button" onClick={() => onEdit(user)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default AdminUserList;
