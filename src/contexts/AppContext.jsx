import { createContext, useContext, useState } from 'react';
import { fetchWithAuth } from '../utils/api';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Estados para elementos seleccionados/activos
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Estados para listas de datos
  const [users, setUsers] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Estados para loading y errores
  const [loading, setLoading] = useState({
    users: false,
    tables: false,
    reservations: false
  });
  const [error, setError] = useState({
    users: null,
    tables: null,
    reservations: null
  });

  const clearSelected = () => {
    setSelectedUser(null);
    setSelectedTable(null);
    setSelectedReservation(null);
  };

  // Funciones para manejar tablas
  const fetchTables = async () => {
    try {
      setLoading(prev => ({ ...prev, tables: true }));
      setError(prev => ({ ...prev, tables: null }));
      const data = await fetchWithAuth('http://localhost:8000/api/tables');
      setTables(data);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError(prev => ({ ...prev, tables: 'Failed to fetch tables' }));
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };

  const updateTable = async (tableData) => {
    try {
      setLoading(prev => ({ ...prev, tables: true }));
      setError(prev => ({ ...prev, tables: null }));

      console.log('Updating table:', {
        id: selectedTable.id,
        data: tableData
      });

      await fetchWithAuth(`http://localhost:8000/api/tables/${selectedTable.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      // Actualizar la lista de mesas
      await fetchTables();
      
      // Limpiar la selección
      setSelectedTable(null);
    } catch (err) {
      console.error('Error updating table:', err);
      setError(prev => ({ ...prev, tables: 'Failed to update table' }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };

  const createTable = async (tableData) => {
    try {
      setLoading(prev => ({ ...prev, tables: true }));
      setError(prev => ({ ...prev, tables: null }));

      const response = await fetchWithAuth('http://localhost:8000/api/tables', {
        method: 'POST',
        body: JSON.stringify(tableData)
      });

      // Actualizar la lista de mesas
      await fetchTables();
      
      // Limpiar la selección
      setSelectedTable(null);

      return response;
    } catch (err) {
      console.error('Error creating table:', err);
      setError(prev => ({ ...prev, tables: 'Failed to create table' }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, tables: false }));
    }
  };

  const value = {
    // Selected items
    selectedUser,
    setSelectedUser,
    selectedTable,
    setSelectedTable,
    selectedReservation,
    setSelectedReservation,
    clearSelected,

    // Data lists
    users,
    setUsers,
    tables,
    setTables,
    reservations,
    setReservations,

    // Loading states
    loading,
    setLoading,

    // Error states
    error,
    setError,

    // Table functions
    fetchTables,
    updateTable,
    createTable
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
