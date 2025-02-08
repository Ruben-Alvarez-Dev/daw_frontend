import { useState, useEffect, useCallback } from 'react';

// Configuración por defecto que solo se usa si no hay configuración en el backend
const DEFAULT_CONFIG = {
    simultaneousTables: 2,
    timeInterval: 15,
    openingHours: {
        lunch: {
            open: '13:00',
            close: '16:00'
        },
        dinner: {
            open: '20:00',
            close: '23:30'
        }
    }
};

const useRestaurantConfig = (token) => {
    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [reservations, setReservations] = useState([]);
    const [currentDate, setCurrentDate] = useState(null);
    const [userId, setUserId] = useState(null);

    // Fetch restaurant configuration
    useEffect(() => {
        if (!token) return;

        const fetchConfig = async () => {
            try {
                console.log('Fetching restaurant config...');
                const response = await fetch('http://localhost:8000/api/config', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Error fetching config');
                const data = await response.json();
                
                console.log('Received config from backend:', data);
                
                // La configuración del backend tiene prioridad
                // Solo usamos DEFAULT_CONFIG para campos que no existan
                const newConfig = {
                    ...DEFAULT_CONFIG,  // Valores por defecto base
                    ...data,            // Sobreescribimos con datos del backend
                    // Aseguramos que openingHours mantiene su estructura
                    openingHours: {
                        ...DEFAULT_CONFIG.openingHours,
                        ...(data.openingHours || {})
                    }
                };

                console.log('Final config after merging:', newConfig);
                setConfig(newConfig);
            } catch (error) {
                console.error('Error fetching config:', error);
                setConfig(DEFAULT_CONFIG); // Solo usamos default completo en caso de error
            } finally {
                setConfigLoading(false);
            }
        };

        fetchConfig();
    }, [token]);

    useEffect(() => {
        if (token) {
            // Decodificar el token JWT para obtener el ID del usuario
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const payload = JSON.parse(jsonPayload);
                setUserId(payload.sub); // El ID del usuario está en el campo 'sub' del token
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [token]);

    // Fetch reservations for a specific date
    const fetchReservations = useCallback(async (date) => {
        if (!date || !token || date === currentDate) {
            console.log('Skipping reservation fetch:', { date, currentDate, hasToken: !!token });
            return;
        }

        try {
            console.log('Fetching reservations for date:', date);
            const response = await fetch(`http://localhost:8000/api/reservations/date/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error fetching reservations');
            const data = await response.json();
            
            console.log('Received reservations:', data);
            
            setReservations(Array.isArray(data) ? data : []);
            setCurrentDate(date);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
        }
    }, [token, currentDate]);

    return {
        config,
        configLoading,
        currentDate,
        fetchReservations,
        reservations,
        userId
    };
};

export default useRestaurantConfig;
