import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const { token } = useAuth();

    const fetchReservations = useCallback(async (date, shift) => {
        try {
            const url = new URL(`${import.meta.env.VITE_API_URL}/api/reservations`);
            if (date && shift) {
                url.searchParams.append('date', date);
                url.searchParams.append('shift', shift);
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las reservas');
            }

            const data = await response.json();
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchReservations();
        }
    }, [token, fetchReservations]);

    const value = {
        reservations,
        selectedReservation,
        setSelectedReservation,
        fetchReservations
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
        throw new Error('useDashboard debe ser usado dentro de un DashboardProvider');
    }
    return context;
}
