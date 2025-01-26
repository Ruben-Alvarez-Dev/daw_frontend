import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import '../../../src/styles/admin.css';

const AdminUserList = forwardRef(({ onEdit, selectedId }, ref) => {
  const { users, loading, error, fetchUsers, deactivateUser } = useUser();
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    fetchUsers(showInactive);
  }, [fetchUsers, showInactive]);

  useImperativeHandle(ref, () => ({
    refresh: () => fetchUsers(showInactive)
  }));

  const handleDeactivate = async (id) => {
    try {
      await deactivateUser(id);
      fetchUsers(showInactive);
    } catch (err) {
      console.error('Error deactivating user:', err);
    }
  };

  const translateStatus = (activeUntil) => {
    if (!activeUntil) return { text: 'Activo', class: 'admin-item__status--active' };
    const now = new Date();
    const until = new Date(activeUntil);
    return now > until 
      ? { text: 'Inactivo', class: 'admin-item__status--inactive' }
      : { text: 'Activo hasta ' + until.toLocaleDateString(), class: 'admin-item__status--pending' };
  };

  const filteredUsers = users.filter(user => {
    if (!showInactive) {
      return !user.active_until || new Date(user.active_until) > new Date();
    }
    return true;
  });

  if (loading) return <div className="admin-list">Cargando usuarios...</div>;

  return (
    <div className="admin-list">
      <div className="admin-list__header">
        <h2 className="admin-list__title">Lista de Usuarios</h2>
        <div className="admin-list__controls">
          <label className="admin-list__checkbox-label">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="admin-list__checkbox"
            />
            Mostrar inactivos
          </label>
          <Link
            to="new"
            className="admin-list__new-button"
          >
            Nuevo Usuario
          </Link>
        </div>
      </div>

      {error && <div className="admin-list__error">{error}</div>}
      
      <ul className="admin-list__items">
        {filteredUsers.map(user => {
          const status = translateStatus(user.active_until);
          const isInactive = user.active_until && new Date(user.active_until) < new Date();
          const isSelected = selectedId === user.id;
          
          return (
            <li key={user.id} className={`admin-item ${isInactive ? 'admin-item--inactive' : ''} ${isSelected ? 'admin-item--selected' : ''}`}>
              <div className="admin-item__info">
                <h3 className="admin-item__name">
                  {user.name} <span className="admin-item__id">(ID: {user.id})</span>
                </h3>
                <p className="admin-item__details">
                  {user.email && `Email: ${user.email} | `}
                  {user.phone && `Teléfono: ${user.phone} | `}
                  Rol: {user.role} |
                  <span className={`admin-item__status ${status.class}`}> Estado: {status.text}</span>
                </p>
              </div>
              <div className="admin-item__actions">
                <Link
                  to={`edit/${user.id}`}
                  className="admin-item__action admin-item__action--edit"
                >
                  Editar
                </Link>
                {(!user.active_until || new Date(user.active_until) > new Date()) && (
                  <button
                    onClick={() => handleDeactivate(user.id)}
                    className="admin-item__action admin-item__action--deactivate"
                  >
                    Desactivar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

AdminUserList.displayName = 'AdminUserList';

export default AdminUserList;
