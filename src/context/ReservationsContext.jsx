import React, { createContext, useContext, useState } from 'react';

const ReservationsContext = createContext();

export const useReservations = () => {
    const context = useContext(ReservationsContext);
    if (!context) {
        throw new Error('useReservations must be used within a ReservationsProvider');
    }
    return context;
};

export const ReservationsProvider = ({ children }) => {
    const [reservations, setReservations] = useState([]);

    const value = {
        reservations,
        setReservations
    };

    return (
        <ReservationsContext.Provider value={value}>
            {children}
        </ReservationsContext.Provider>
    );
};
