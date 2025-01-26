import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useConfiguration } from './ConfigurationContext';

const TablesContext = createContext();

export function TablesProvider({ children }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { updateConfig } = useConfiguration();

  const fetchTables = async () => {
    if (!token) return;
    
    setLoading(true);
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
      setTables(data.tables);
      
      // Calcular y actualizar la capacidad total
      const totalCapacity = data.tables.reduce((sum, table) => sum + table.capacity, 0);
      updateConfig(prev => ({
        ...prev,
        totalCapacity
      }));
      
    } catch (err) {
      setError('Error al cargar las mesas');
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTables();
    }
  }, [token]);

  const createTable = async (tableData) => {
    if (!token) return null;
    
    try {
      const response = await fetch('http://localhost:8000/api/tables', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      if (!response.ok) {
        throw new Error('Error al crear la mesa');
      }

      await fetchTables(); // Actualiza las mesas y la capacidad total
      return true;
    } catch (err) {
      console.error('Error creating table:', err);
      return false;
    }
  };

  const updateTable = async (id, tableData) => {
    if (!token) return null;
    
    try {
      const response = await fetch(`http://localhost:8000/api/tables/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(tableData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la mesa');
      }

      await fetchTables(); // Actualiza las mesas y la capacidad total
      return true;
    } catch (err) {
      console.error('Error updating table:', err);
      return false;
    }
  };

  const deleteTable = async (id) => {
    if (!token) return null;
    
    try {
      const response = await fetch(`http://localhost:8000/api/tables/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la mesa');
      }

      await fetchTables(); // Actualiza las mesas y la capacidad total
      return true;
    } catch (err) {
      console.error('Error deleting table:', err);
      return false;
    }
  };

  return (
    <TablesContext.Provider 
      value={{ 
        tables, 
        loading, 
        error, 
        fetchTables,
        createTable,
        updateTable,
        deleteTable
      }}
    >
      {children}
    </TablesContext.Provider>
  );
}

export function useTables() {
  const context = useContext(TablesContext);
  if (!context) {
    throw new Error('useTables must be used within a TablesProvider');
  }
  return context;
}
