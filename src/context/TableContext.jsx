import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const TableContext = createContext();

export function TableProvider({ children }) {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchTables = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/tables', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching tables');
            const data = await response.json();
            setTables(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const createTable = useCallback(async (tableData) => {
        if (!token) return;
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
            if (!response.ok) throw new Error('Error creating table');
            const newTable = await response.json();
            setTables(prev => [...prev, newTable]);
            return newTable;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const updateTable = useCallback(async (id, tableData) => {
        if (!token) return;
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
            if (!response.ok) throw new Error('Error updating table');
            const updatedTable = await response.json();
            setTables(prev => prev.map(table => table.id === id ? updatedTable : table));
            return updatedTable;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const deleteTable = useCallback(async (id) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/tables/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error deleting table');
            setTables(prev => prev.filter(table => table.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    return (
        <TableContext.Provider value={{
            tables,
            loading,
            error,
            fetchTables,
            createTable,
            updateTable,
            deleteTable
        }}>
            {children}
        </TableContext.Provider>
    );
}

export function useTable() {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
}
