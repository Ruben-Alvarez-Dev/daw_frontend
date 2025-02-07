import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedTables, setSelectedTables] = useState([]);
    const [tables, setTables] = useState([]);
    const [distribution, setDistribution] = useState({});
    const [users, setUsers] = useState({});
    const { token } = useAuth();

    const loadUserDetails = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar los detalles del usuario');
            }

            const userData = await response.json();
            setUsers(prev => ({ ...prev, [userId]: userData }));
            return userData;
        } catch (error) {
            console.error('Error loading user details:', error);
            return null;
        }
    };

    const createShiftIfNeeded = async (date, shift, reservationsList) => {
        if (!reservationsList || reservationsList.length === 0) return;

        try {
            // Primero intentamos obtener el shift
            const shiftResponse = await fetch(
                `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            // Si el shift no existe (404) y hay reservas, lo creamos
            if (shiftResponse.status === 404) {
                // Obtenemos los IDs de las reservas no canceladas
                const reservationIds = reservationsList
                    .filter(res => res.status !== 'cancelled')
                    .map(res => res.id);

                await fetch(
                    `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            reservations: reservationIds
                        })
                    }
                );
            }
        } catch (error) {
            console.error('Error creating shift:', error);
        }
    };

    const loadReservations = async (date, shift) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/date/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las reservas');
            }

            const data = await response.json();
            const filteredReservations = data.filter(res => res.shift === shift);
            setReservations(filteredReservations);

            // Cargar detalles de usuarios que no tengamos ya cargados
            const uniqueUserIds = [...new Set(filteredReservations.map(r => r.user_id))];
            const missingUserIds = uniqueUserIds.filter(id => !users[id]);
            
            await Promise.all(missingUserIds.map(loadUserDetails));

            // Crear shift si hay reservas pero no existe
            await createShiftIfNeeded(date, shift, filteredReservations);
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    };

    const loadTablesAndDistribution = async (date, shift) => {
        try {
            const tablesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!tablesResponse.ok) {
                throw new Error('Error al cargar las mesas');
            }

            const tablesData = await tablesResponse.json();
            setTables(tablesData);

            if (date && shift) {
                const shiftResponse = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/shifts/${date}/${shift}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );

                if (!shiftResponse.ok && shiftResponse.status !== 404) {
                    throw new Error('Error al cargar la distribución');
                }

                if (shiftResponse.ok) {
                    const shiftData = await shiftResponse.json();
                    setDistribution(shiftData.distribution || {});
                } else {
                    setDistribution({});
                }
            }
        } catch (error) {
            console.error('Error loading tables and distribution:', error);
        }
    };

    const handleReservationSelect = async (reservationId, date, shift) => {
        if (selectedReservation === reservationId) {
            if (selectedTables.length > 0) {
                try {
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
                                reservation_id: reservationId,
                                tables: selectedTables
                            })
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Error al asignar mesas');
                    }

                    await loadTablesAndDistribution(date, shift);
                    await loadReservations(date, shift);
                } catch (error) {
                    console.error('Error saving table assignments:', error);
                }
            }

            setSelectedReservation(null);
            setSelectedTables([]);
        } else {
            setSelectedReservation(reservationId);
            const currentTables = Object.entries(distribution)
                .filter(([_, resId]) => resId === reservationId)
                .map(([tableId]) => tableId);
            setSelectedTables(currentTables);
        }
    };

    const toggleTableSelection = (tableId) => {
        if (!selectedReservation) return;

        setSelectedTables(prev => {
            const tableIdStr = tableId.toString();
            return prev.includes(tableIdStr)
                ? prev.filter(id => id !== tableIdStr)
                : [...prev, tableIdStr];
        });
    };

    const value = {
        reservations,
        selectedReservation,
        selectedTables,
        tables,
        distribution,
        users,
        loadReservations,
        loadTablesAndDistribution,
        handleReservationSelect,
        toggleTableSelection,
        setSelectedReservation
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
