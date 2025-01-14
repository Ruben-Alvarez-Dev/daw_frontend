import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminTableList = forwardRef((props, ref) => {
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
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Lista de Mesas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!error && tables.length === 0 ? (
        <p className="text-gray-500">No hay mesas registradas</p>
      ) : (
        <div className="space-y-4">
          {tables.map(table => (
            <div key={table.id} className="p-4 bg-white shadow rounded-lg">
              <p className="font-medium">Mesa: {table.name}</p>
              <p>Capacidad: {table.capacity} personas</p>
              <p>Estado: {translateStatus(table.status)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default AdminTableList;
