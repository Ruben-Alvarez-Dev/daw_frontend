import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

const DEFAULT_SHIFT_DATA = {
    tables: {},          // id -> { id, name, capacity }
    reservations: {},    // id -> { id, guests, status, user }
    distribution: {},    // table_id -> reservation_id
    total_pax: 0
};

export function DashboardProvider({ children }) {
    const { token } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedShift, setSelectedShift] = useState(null);
    const [shiftData, setShiftData] = useState({
        total_pax: 0,
        tables: {},
        reservations: {},
        distribution: {}
    });
    const [selectedTables, setSelectedTables] = useState([]);

    // Cargar las mesas una sola vez al inicio
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

                const tablesData = await response.json();
                const tablesById = tablesData.reduce((acc, table) => ({
                    ...acc,
                    [table.id]: table
                }), {});

                setShiftData(prev => ({
                    ...prev,
                    tables: tablesById
                }));
            } catch (error) {
                console.error('Error loading tables:', error);
                setShiftData(prev => ({
                    ...prev,
                    tables: {}
                }));
            }
        };

        loadTables();
    }, [token]);

    const loadReservations = useCallback(async (date, shift) => {
        if (!token || !date || !shift) {
            setReservations([]);
            setShiftData(prev => ({
                ...prev,
                reservations: {},
                distribution: {},
                total_pax: 0
            }));
            setSelectedDate(null);
            setSelectedShift(null);
            return;
        }

        setSelectedDate(date);
        setSelectedShift(shift);

        try {
            // 2. Cargar la información del shift
            const shiftResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!shiftResponse.ok) {
                throw new Error('Error loading shift data');
            }

            const shiftResponseData = await shiftResponse.json();

            // 4. Actualizar el estado
            setReservations(Object.values(shiftResponseData.reservations || {}));
            setShiftData(prev => ({
                ...prev,
                total_pax: shiftResponseData.total_pax || 0,
                reservations: shiftResponseData.reservations || {},
                distribution: shiftResponseData.distribution || {}
            }));

        } catch (error) {
            console.error('Error loading data:', error);
            setReservations([]);
            setShiftData(prev => ({
                ...prev,
                reservations: {},
                distribution: {},
                total_pax: 0
            }));
        }
    }, [token]);

    const tables = useMemo(() => {
        return Object.values(shiftData?.tables || {});
    }, [shiftData]);

    const handleReservationSelect = useCallback((reservationId) => {
        // Si ya hay una reserva seleccionada y es la misma que se clickea
        if (selectedReservation === reservationId) {
            setSelectedReservation(null);
            setSelectedTables([]); // Limpiar mesas seleccionadas
            return;
        }

        // Si no hay reserva seleccionada o es diferente, la seleccionamos
        setSelectedReservation(reservationId);
        setSelectedTables([]); // Limpiar mesas seleccionadas al cambiar de reserva
    }, [selectedReservation]);

    const toggleTableSelection = useCallback(async (tableId, date, shift) => {
        if (!selectedReservation) return;

        try {
            const tableKey = `table_${tableId}`;
            const currentAssignment = shiftData?.distribution?.[tableKey];
            
            // Si la mesa ya está asignada a esta reserva, la desasignamos
            if (currentAssignment && parseInt(currentAssignment) === parseInt(selectedReservation)) {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}/unassign`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            assignments: [{
                                table_id: tableId,
                                reservation_id: parseInt(selectedReservation)
                            }]
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al desasignar mesa');
                }

                const result = await response.json();
                setShiftData(prev => ({
                    ...prev,
                    distribution: result.distribution || {},
                    reservations: result.reservations || {},
                    total_pax: result.total_pax || prev.total_pax
                }));
                setReservations(Object.values(result.reservations || {}));
                setSelectedTables([]); // Limpiar selección al desasignar
            }
            // Si la mesa está libre o asignada a otra reserva, la añadimos a la selección
            else {
                // Verificar si la mesa ya está asignada a otra reserva
                if (currentAssignment) {
                    alert('Esta mesa ya está asignada a otra reserva');
                    return;
                }

                // Añadir o quitar la mesa de la selección
                setSelectedTables(prev => {
                    const index = prev.indexOf(tableId);
                    if (index > -1) {
                        return prev.filter(id => id !== tableId);
                    } else {
                        return [...prev, tableId];
                    }
                });
            }
        } catch (error) {
            console.error('Error toggling table assignment:', error);
            alert(error.message);
        }
    }, [selectedReservation, shiftData, token]);

    const assignSelectedTables = useCallback(async (date, shift) => {
        if (!selectedReservation || selectedTables.length === 0) return false;

        try {
            // Primero cargar los datos actuales del turno para tener la info más reciente
            const shiftResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!shiftResponse.ok) {
                throw new Error('Error al cargar datos del turno');
            }

            // Asignar las mesas seleccionadas
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}/assign`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        assignments: selectedTables.map(tableId => ({
                            table_id: tableId,
                            reservation_id: parseInt(selectedReservation)
                        }))
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al asignar mesas');
            }

            const result = await response.json();
            
            // Actualizar el estado con los nuevos datos
            setShiftData(prev => ({
                ...prev,
                distribution: result.distribution || {},
                reservations: result.reservations || {},
                total_pax: result.total_pax || prev.total_pax
            }));

            // Actualizar las reservaciones con los nuevos datos
            setReservations(Object.values(result.reservations || {}));
            
            // Limpiar selección después de asignar
            setSelectedTables([]);
            return true; // Indicar que la asignación fue exitosa
        } catch (error) {
            console.error('Error assigning tables:', error);
            alert(error.message);
            return false; // Indicar que la asignación falló
        }
    }, [selectedReservation, selectedTables, token]);

    const value = {
        tables,
        reservations,
        selectedReservation,
        selectedDate,
        selectedShift,
        shiftData,
        loadReservations,
        handleReservationSelect,
        toggleTableSelection,
        assignSelectedTables,
        selectedTables
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
