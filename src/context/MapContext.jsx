import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MapContext = createContext();

export function MapProvider({ children }) {
    const [layouts, setLayouts] = useState([]);
    const [defaultLayout, setDefaultLayout] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchLayouts = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/map-layouts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching layouts');
            const data = await response.json();
            setLayouts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchDefaultLayout = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/map-layouts/default', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching default layout');
            const data = await response.json();
            setDefaultLayout(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const createLayout = useCallback(async (layoutData) => {
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/map-layouts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(layoutData)
            });
            if (!response.ok) throw new Error('Error creating layout');
            const newLayout = await response.json();
            setLayouts(prev => [...prev, newLayout]);
            return newLayout;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const setLayoutAsDefault = useCallback(async (layoutId) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/map-layouts/${layoutId}/default`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error setting default layout');
            const data = await response.json();
            setDefaultLayout(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const deleteLayout = useCallback(async (layoutId) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/map-layouts/${layoutId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error deleting layout');
            setLayouts(prev => prev.filter(layout => layout.id !== layoutId));
            if (defaultLayout?.id === layoutId) {
                setDefaultLayout(null);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token, defaultLayout]);

    return (
        <MapContext.Provider value={{
            layouts,
            defaultLayout,
            loading,
            error,
            fetchLayouts,
            fetchDefaultLayout,
            createLayout,
            setLayoutAsDefault,
            deleteLayout
        }}>
            {children}
        </MapContext.Provider>
    );
}

export function useMap() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
}
