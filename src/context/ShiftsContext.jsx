import React, { createContext, useContext, useState, useRef } from 'react';
import { useAuth } from './AuthContext';

const ShiftsContext = createContext();

export function ShiftsProvider({ children }) {
    const [currentShift, setCurrentShift] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const fetchingRef = useRef(false);

    const fetchShiftConfiguration = async (date, type) => {
        // Si ya hay una petición en curso, no hacer nada
        if (fetchingRef.current) return;
        
        try {
            fetchingRef.current = true;
            setIsLoading(true);
            setError(null);
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shifts/configuration/${date}/${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar la configuración del turno');
            }

            const data = await response.json();
            setCurrentShift({
                date: data.date,
                type: data.type,
                tables: data.tables || [],
                reservations: data.reservations || [],
                distribution: data.distribution || {},
                exists: data.exists
            });
        } catch (error) {
            setError('Error al cargar la configuración del turno');
            console.error('Error fetching shift configuration:', error);
        } finally {
            setIsLoading(false);
            fetchingRef.current = false;
        }
    };

    const saveShiftConfiguration = async (date, type, distribution) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shifts/configuration/${date}/${type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ distribution })
            });

            if (!response.ok) {
                throw new Error('Error al guardar la configuración del turno');
            }

            const data = await response.json();
            setCurrentShift(prev => ({
                ...prev,
                tables: data.tables || prev.tables || [],
                distribution: data.distribution || {},
                exists: true
            }));

            return data;
        } catch (error) {
            console.error('Error saving shift configuration:', error);
            throw error;
        }
    };

    return (
        <ShiftsContext.Provider value={{
            currentShift,
            isLoading,
            error,
            fetchShiftConfiguration,
            saveShiftConfiguration
        }}>
            {children}
        </ShiftsContext.Provider>
    );
}

export function useShifts() {
    const context = useContext(ShiftsContext);
    if (!context) {
        throw new Error('useShifts must be used within a ShiftsProvider');
    }
    return context;
}
