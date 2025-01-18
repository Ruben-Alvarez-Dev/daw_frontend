import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminTableList.css';

const AdminTableList = forwardRef(({ onEdit }, ref) => {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tables', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las mesas');
      }

      const data = await response.json();
      setTables(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las mesas');
      console.error('Error fetching tables:', err);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchTables
  }));

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tables/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la mesa');
      }

      fetchTables();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTables();
    }
  }, [token]);

  const translateStatus = (status) => {
    const statusMap = {
      'available': 'Disponible',
      'occupied': 'Ocupada',
      'reserved': 'Reservada'
    };
    return statusMap[status] || status;
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <ul className="admin-tables-list">
        {tables.map(table => (
          <li key={table.id} className="table-item">
            <div className="table-line">
              <span className="table-field">ID: {table.id}</span>
              <span className="table-field">Nombre: {table.name}</span>
            </div>
            <div className="table-line">
              <span className="table-field">Capacidad: {table.capacity} personas</span>
              <span className="table-field">Estado: {translateStatus(table.status)}</span>
            </div>
            <div className="table-line">
              <div className="button-group">
                <button className="edit-button" onClick={() => onEdit(table)}>
                  Editar
                </button>
                <button className="delete-button" onClick={() => handleDelete(table.id)}>
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

export default AdminTableList;
