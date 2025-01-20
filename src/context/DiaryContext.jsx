import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const DiaryContext = createContext();

export function DiaryProvider({ children }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedShift, setSelectedShift] = useState('afternoon');
    const [dailyReservations, setDailyReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchDailyReservations = useCallback(async (date = selectedDate, shift = selectedShift) => {
        if (!token) return;
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const response = await fetch(`http://localhost:8000/api/reservations/date/${dateStr}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching daily reservations');
            const data = await response.json();
            
            // Filtrar por turno si es necesario
            const filteredData = shift ? data.filter(reservation => {
                const [hours, minutes] = reservation.time.split(':').map(Number);
                const timeAsNumber = hours + minutes/60;
                
                // Estos valores deberían venir de la configuración del restaurante
                const shifts = {
                    afternoon: { start: 13, end: 16 },
                    evening: { start: 20, end: 23 }
                };
                
                return timeAsNumber >= shifts[shift].start && timeAsNumber <= shifts[shift].end;
            }) : data;

            setDailyReservations(filteredData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, selectedDate, selectedShift]);

    const updateReservationTables = useCallback(async (reservationId, tableIds) => {
        if (!token) return;
        try {
            const reservation = dailyReservations.find(r => r.id === reservationId);
            if (!reservation) throw new Error('Reservation not found');

            const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...reservation,
                    tables_ids: tableIds
                })
            });
            
            if (!response.ok) throw new Error('Error updating reservation tables');
            const updatedReservation = await response.json();
            
            setDailyReservations(prev => 
                prev.map(r => r.id === reservationId ? updatedReservation : r)
            );
            
            return updatedReservation;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token, dailyReservations]);

    return (
        <DiaryContext.Provider value={{
            selectedDate,
            setSelectedDate,
            selectedShift,
            setSelectedShift,
            dailyReservations,
            loading,
            error,
            fetchDailyReservations,
            updateReservationTables
        }}>
            {children}
        </DiaryContext.Provider>
    );
}

export function useDiary() {
    const context = useContext(DiaryContext);
    if (!context) {
        throw new Error('useDiary must be used within a DiaryProvider');
    }
    return context;
}
