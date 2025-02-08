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
            // 1. Cargar las reservas del día
            const reservationsResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reservations/date/${date}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!reservationsResponse.ok) {
                throw new Error('Error loading reservations');
            }

            const reservationsData = await reservationsResponse.json();

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

            // 3. Procesar los datos
            const reservationsById = {};
            reservationsData.forEach(reservation => {
                if (reservation.shift === shift) {
                    reservationsById[reservation.id] = reservation;
                }
            });

            // 4. Actualizar el estado
            setReservations(Object.values(reservationsById));
            setShiftData(prev => ({
                ...prev,
                total_pax: shiftResponseData.total_pax || 0,
                reservations: reservationsById,
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

    const handleReservationSelect = useCallback(async (reservationId, date, shift) => {
        // Si ya hay una reserva seleccionada y es la misma que se clickea
        if (selectedReservation === reservationId) {
            setSelectedReservation(null);
            return;
        }

        // Si no hay reserva seleccionada o es diferente, la seleccionamos
        setSelectedReservation(reservationId);
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
                    distribution: result.distribution || {}
                }));
            }
            // Si la mesa está libre o asignada a otra reserva, la asignamos a esta
            else {
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
                            assignments: [{
                                table_id: tableId,
                                reservation_id: parseInt(selectedReservation)
                            }]
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al asignar mesa');
                }

                const result = await response.json();
                setShiftData(prev => ({
                    ...prev,
                    distribution: result.distribution || {}
                }));
            }
        } catch (error) {
            console.error('Error toggling table assignment:', error);
        }
    }, [selectedReservation, shiftData, token]);

    const value = {
        tables,
        reservations,
        selectedReservation,
        selectedDate,
        selectedShift,
        shiftData,
        loadReservations,
        handleReservationSelect,
        toggleTableSelection
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
