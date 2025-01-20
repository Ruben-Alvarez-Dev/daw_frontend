import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AssignationContext = createContext();

export function AssignationProvider({ children }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchAssignments = useCallback(async (date) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/bookings?date=${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching assignments');
            const data = await response.json();
            setAssignments(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const assignTable = useCallback(async (reservationId, tableId) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/bookings/${reservationId}/assign-table`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ table_id: tableId })
            });
            if (!response.ok) throw new Error('Error assigning table');
            const updatedAssignment = await response.json();
            setAssignments(prev => 
                prev.map(assignment => 
                    assignment.id === reservationId ? updatedAssignment : assignment
                )
            );
            return updatedAssignment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const unassignTable = useCallback(async (reservationId, tableId) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/bookings/${reservationId}/unassign-table`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ table_id: tableId })
            });
            if (!response.ok) throw new Error('Error unassigning table');
            const updatedAssignment = await response.json();
            setAssignments(prev => 
                prev.map(assignment => 
                    assignment.id === reservationId ? updatedAssignment : assignment
                )
            );
            return updatedAssignment;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    return (
        <AssignationContext.Provider value={{
            assignments,
            loading,
            error,
            fetchAssignments,
            assignTable,
            unassignTable
        }}>
            {children}
        </AssignationContext.Provider>
    );
}

export function useAssignation() {
    const context = useContext(AssignationContext);
    if (!context) {
        throw new Error('useAssignation must be used within an AssignationProvider');
    }
    return context;
}
