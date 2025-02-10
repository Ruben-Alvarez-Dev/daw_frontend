import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const { token } = useAuth();

    // Current shift state
    const [currentShift, setCurrentShift] = useState({
        date: null,
        shift: null,
        tables: {},
        reservations: {},
        distribution: {},
        total_pax: 0
    });

    // UI state
    const [ui, setUi] = useState({
        selectedReservation: null,
        selectedTables: {},
        hoveredReservation: null
    });

    // Error state
    const [error, setError] = useState(null);

    // Load tables on mount
    useEffect(() => {
        const loadTables = async () => {
            if (!token) return;

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/tables`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Error loading tables');
                }

                const data = await response.json();
                setCurrentShift(prev => ({
                    ...prev,
                    tables: data.reduce((acc, table) => {
                        acc[table.id] = table;
                        return acc;
                    }, {})
                }));
            } catch (error) {
                console.error('Error loading tables:', error);
            }
        };

        loadTables();
    }, [token]);

    // Load shift data
    const loadShift = useCallback(async (date, shift) => {
        if (!token || !date || !shift) return;

        try {
            // Asegurar que la fecha está en formato YYYY-MM-DD
            let formattedDate;
            if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
                formattedDate = date;
            } else {
                const d = new Date(date);
                formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shifts/${formattedDate}/${shift}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error loading shift data');
            }

            const data = await response.json();
            
            setCurrentShift({
                date: formattedDate,
                shift,
                tables: data.tables || {},
                reservations: data.reservations || {},
                distribution: data.distribution || {},
                total_pax: data.total_pax || 0
            });
            setError(null);
        } catch (error) {
            console.error('Error loading shift data:', error);
            setError(error.response?.data?.error || 'Error loading shift data');
        }
    }, [token]);

    // Table assignment
    const assignTable = useCallback(async (reservationId, tableId) => {
        if (!token || !currentShift.date || !currentShift.shift) return;

        try {
            const response = await api.post(`/api/shifts/${currentShift.date}/${currentShift.shift}/assign`, {
                assignments: [{
                    table_id: tableId,
                    reservation_id: reservationId
                }]
            });

            // Actualizar el estado con la nueva distribución
            if (response.data) {
                setCurrentShift(prev => ({
                    ...prev,
                    distribution: response.data.distribution || prev.distribution,
                    tables: response.data.tables || prev.tables,
                    reservations: response.data.reservations || prev.reservations
                }));
            }
            setError(null);
            return response.data;
        } catch (error) {
            console.error('Error assigning table:', error);
            setError(error.response?.data?.error || 'Error assigning table');
            throw error;
        }
    }, [token, currentShift.date, currentShift.shift]);

    // Unassign table
    const unassignTable = useCallback(async (reservationId, tableId) => {
        if (!token || !currentShift.date || !currentShift.shift) return;

        try {
            const response = await api.post(`/api/shifts/${currentShift.date}/${currentShift.shift}/unassign`, {
                assignments: [{
                    table_id: tableId,
                    reservation_id: reservationId
                }]
            });

            // Actualizar el estado eliminando la asignación
            if (response.data) {
                setCurrentShift(prev => ({
                    ...prev,
                    distribution: response.data.distribution || prev.distribution,
                    tables: response.data.tables || prev.tables,
                    reservations: response.data.reservations || prev.reservations
                }));
            }
            setError(null);
            return response.data;
        } catch (error) {
            console.error('Error unassigning table:', error);
            setError(error.response?.data?.error || 'Error unassigning table');
            throw error;
        }
    }, [token, currentShift.date, currentShift.shift]);

    // Update reservation status
    const updateReservationStatus = useCallback(async (reservationId, newStatus) => {
        if (!token) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reservations/${reservationId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );

            if (!response.ok) {
                throw new Error('Error updating reservation status');
            }

            setCurrentShift(prev => ({
                ...prev,
                reservations: {
                    ...prev.reservations,
                    [reservationId]: {
                        ...prev.reservations[reservationId],
                        status: newStatus
                    }
                }
            }));
            setError(null);
        } catch (error) {
            console.error('Error updating reservation status:', error);
            setError(error.response?.data?.error || 'Error updating reservation status');
            throw error;
        }
    }, [token]);

    // UI Actions
    const selectReservation = useCallback((reservationId) => {
        setUi(prev => ({
            ...prev,
            selectedReservation: reservationId,
            // Clear selected tables when changing reservation
            selectedTables: {}
        }));
    }, []);

    const toggleTableSelection = useCallback((tableId) => {
        setUi(prev => ({
            ...prev,
            selectedTables: {
                ...prev.selectedTables,
                [tableId]: !prev.selectedTables[tableId]
            }
        }));
    }, []);

    const setHoveredReservation = useCallback((reservationId) => {
        setUi(prev => ({
            ...prev,
            hoveredReservation: reservationId
        }));
    }, []);

    // Función para recargar el estado actual del turno
    const refreshCurrentShift = useCallback(async () => {
        if (currentShift.date && currentShift.shift) {
            await loadShift(currentShift.date, currentShift.shift);
        }
    }, [currentShift.date, currentShift.shift, loadShift]);

    const value = {
        // State
        currentShift,
        ui,

        // Shift Management
        loadShift,

        // Table Management
        assignTable,
        unassignTable,

        // Reservation Management
        updateReservationStatus,

        // UI Actions
        selectReservation,
        toggleTableSelection,
        setHoveredReservation,

        // Refresh current shift
        refreshCurrentShift,

        // Error
        error
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
