import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../layout/Button/Button';
import './AdminUserList.css';

export default function AdminUserList({ onEdit }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  return (
    <div className="admin-user-list">
      {error && <div className="error-message">{error}</div>}
      
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <span className="user-role">{user.role === 'customer' ? 'Cliente' : 'Administrador'}</span>
            </div>
            <Button
              variant="secondary"
              size="small"
              label="Editar"
              onClick={() => onEdit(user)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
