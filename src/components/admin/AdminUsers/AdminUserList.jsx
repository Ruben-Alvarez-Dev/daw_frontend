import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../common/Button/Button';
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-user-list">
      {error && <div className="error-message">{error}</div>}
      
      <div className="user-list-header">
        <div className="header-item">Usuario</div>
        <div className="header-item">Contacto</div>
        <div className="header-item">Estado</div>
        <div className="header-item">Acciones</div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">No hay usuarios registrados</div>
      ) : (
        <div className="user-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-info">
                <div className="user-name">
                  <h4>{user.name}</h4>
                  <span className={`user-role ${user.role}`}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </div>

              <div className="user-contact">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  {user.email || 'Sin email'}
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  {user.phone || 'Sin teléfono'}
                </div>
              </div>

              <div className="user-status">
                <div className="status-item">
                  <span className="status-label">Registro:</span>
                  <span className="status-value">{formatDate(user.created_at)}</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Última visita:</span>
                  <span className="status-value">{user.last_login || 'Nunca'}</span>
                </div>
              </div>

              <div className="user-actions">
                <Button
                  variant="secondary"
                  size="small"
                  label="Editar"
                  onClick={() => onEdit(user)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
