import { useMemo } from 'react';
import { generateTimeOptions } from '../utils/timeUtils';

const useShiftAvailability = (config, reservations = [], selectedDate, shift) => {
    return useMemo(() => {
        // Validar parámetros requeridos
        if (!config || !selectedDate || !shift || !Array.isArray(reservations)) {
            console.log('Missing or invalid parameters:', { config, reservations, selectedDate, shift });
            return [];
        }

        // Asegurar que tenemos el número de mesas simultáneas
        const simultaneousTables = config.simultaneousTables;
        if (typeof simultaneousTables !== 'number') {
            console.error('Invalid simultaneousTables:', simultaneousTables);
            return [];
        }

        const timeSlots = generateTimeOptions(shift);

        console.log('Calculating availability for:', {
            date: selectedDate,
            shift,
            simultaneousTables,
            reservationsCount: reservations.length
        });

        // Si no hay reservas, todos los slots están disponibles
        if (reservations.length === 0) {
            console.log('No reservations found, all slots available');
            return timeSlots.map(time => ({
                time,
                available: simultaneousTables
            }));
        }

        // Filtrar reservas para este turno
        const relevantReservations = reservations.filter(res => res.shift === shift);

        console.log('Relevant reservations for shift:', shift, relevantReservations);

        // Agrupar reservas por hora
        const reservationsCount = {};
        relevantReservations.forEach(res => {
            // Convertir HH:mm:ss a HH:mm
            const time = res.time.substring(0, 5);
            reservationsCount[time] = (reservationsCount[time] || 0) + 1;
        });

        console.log('Reservations count per time:', reservationsCount);

        // Calcular disponibilidad para cada slot
        const availability = timeSlots.map(time => {
            const reservedTables = reservationsCount[time] || 0;
            const available = simultaneousTables - reservedTables;
            
            console.log(`Time ${time}: ${reservedTables} tables reserved, ${available} available (max: ${simultaneousTables})`);
            
            return {
                time,
                available: Math.max(0, available)
            };
        });

        // Filtrar slots sin disponibilidad
        const availableSlots = availability.filter(slot => slot.available > 0);
        
        console.log('Final available slots:', availableSlots);
        
        return availableSlots;
    }, [config, reservations, selectedDate, shift]);
};

export default useShiftAvailability;
