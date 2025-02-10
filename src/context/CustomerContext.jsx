import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CustomerContext = createContext();

export function CustomerProvider({ children }) {
    const { token } = useAuth();

    // State
    const [state, setState] = useState({
        reservations: {
            myReservations: {},  // Indexed by ID for O(1) lookup
            availableSlots: {}   // Indexed by date for O(1) lookup
        },
        ui: {
            loading: false,
            error: null,
            selectedDate: null,
            selectedShift: null
        }
    });

    // Helper function to update UI state
    const setUiState = useCallback((updates) => {
        setState(prev => ({
            ...prev,
            ui: { ...prev.ui, ...updates }
        }));
    }, []);

    // Helper function to update reservations state
    const setReservationsState = useCallback((updates) => {
        setState(prev => ({
            ...prev,
            reservations: { ...prev.reservations, ...updates }
        }));
    }, []);

    // Load user's reservations
    const loadMyReservations = useCallback(async () => {
        if (!token) return;

        setUiState({ loading: true, error: null });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error loading reservations');
            }

            const data = await response.json();
            
            // Transform array to object for O(1) lookup
            const reservationsById = data.reduce((acc, reservation) => {
                acc[reservation.id] = reservation;
                return acc;
            }, {});

            setReservationsState({
                myReservations: reservationsById
            });
        } catch (error) {
            console.error('Error loading reservations:', error);
            setUiState({ error: error.message });
        } finally {
            setUiState({ loading: false });
        }
    }, [token, setUiState, setReservationsState]);

    // Create new reservation
    const createReservation = useCallback(async (reservationData) => {
        if (!token) return;

        setUiState({ loading: true, error: null });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                throw new Error('Error creating reservation');
            }

            const newReservation = await response.json();

            // Add new reservation to state
            setReservationsState(prev => ({
                myReservations: {
                    ...prev.myReservations,
                    [newReservation.id]: newReservation
                }
            }));

            return newReservation;
        } catch (error) {
            console.error('Error creating reservation:', error);
            setUiState({ error: error.message });
            throw error;
        } finally {
            setUiState({ loading: false });
        }
    }, [token, setUiState, setReservationsState]);

    // Cancel reservation
    const cancelReservation = useCallback(async (reservationId) => {
        if (!token) return;

        setUiState({ loading: true, error: null });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/reservations/${reservationId}/cancel`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error cancelling reservation');
            }

            // Update reservation status in state
            setReservationsState(prev => ({
                myReservations: {
                    ...prev.myReservations,
                    [reservationId]: {
                        ...prev.myReservations[reservationId],
                        status: 'cancelled'
                    }
                }
            }));

            return true;
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            setUiState({ error: error.message });
            throw error;
        } finally {
            setUiState({ loading: false });
        }
    }, [token, setUiState, setReservationsState]);

    // Check availability for a date and shift
    const checkAvailability = useCallback(async (date, shift) => {
        if (!token) return;

        setUiState({ loading: true, error: null });

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/availability/${date}/${shift}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Error checking availability');
            }

            const data = await response.json();

            // Update available slots in state
            setReservationsState(prev => ({
                ...prev,
                availableSlots: {
                    ...prev.availableSlots,
                    [date]: {
                        ...prev.availableSlots[date],
                        [shift]: data.availableSlots
                    }
                }
            }));

            return data.availableSlots;
        } catch (error) {
            console.error('Error checking availability:', error);
            setUiState({ error: error.message });
            throw error;
        } finally {
            setUiState({ loading: false });
        }
    }, [token, setUiState, setReservationsState]);

    // Load user's reservations on mount
    React.useEffect(() => {
        loadMyReservations();
    }, [loadMyReservations]);

    const value = {
        // State
        myReservations: state.reservations.myReservations,
        availableSlots: state.reservations.availableSlots,
        loading: state.ui.loading,
        error: state.ui.error,
        selectedDate: state.ui.selectedDate,
        selectedShift: state.ui.selectedShift,

        // Actions
        loadMyReservations,
        createReservation,
        cancelReservation,
        checkAvailability,
        
        // UI Actions
        setSelectedDate: (date) => setUiState({ selectedDate: date }),
        setSelectedShift: (shift) => setUiState({ selectedShift: shift })
    };

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomer() {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
}
