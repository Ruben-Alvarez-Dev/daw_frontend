import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    // Estado para el restaurante activo
    const [activeRestaurant, setActiveRestaurant] = useState(null);
    
    // Estado para la zona activa
    const [activeZone, setActiveZone] = useState(null);
    
    // Estado para la mesa activa
    const [activeTable, setActiveTable] = useState(null);
    
    // Estado para el menú lateral
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Estado para mensajes globales/notificaciones
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const clearActiveItems = () => {
        setActiveRestaurant(null);
        setActiveZone(null);
        setActiveTable(null);
    };

    const value = {
        // Estados activos
        activeRestaurant,
        setActiveRestaurant,
        activeZone,
        setActiveZone,
        activeTable,
        setActiveTable,
        
        // Control del sidebar
        isSidebarOpen,
        toggleSidebar,
        
        // Notificaciones
        notification,
        showNotification,
        
        // Utilidades
        clearActiveItems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
