import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminUserList = forwardRef((props, ref) => {
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

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      {error && <p className="error">{error}</p>}
      {!error && users.length === 0 ? (
        <p>No hay usuarios registrados</p>
      ) : (
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-item">
              <p>Nombre: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Teléfono: {user.phone}</p>
              <p>Rol: {user.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default AdminUserList;
