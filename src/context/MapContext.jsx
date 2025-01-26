import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const MapContext = createContext();

export function MapProvider({ children }) {
    const [map, setMap] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // Fetch del mapa base (único)
    const fetchMap = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/map', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching map');
            const data = await response.json();
            setMap(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Actualizar el mapa base
    const updateMap = useCallback(async (layoutData) => {
        if (!token || !map) return;
        try {
            const response = await fetch(`http://localhost:8000/api/map/${map.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ layout_data: layoutData })
            });
            if (!response.ok) throw new Error('Error updating map');
            const updatedMap = await response.json();
            setMap(updatedMap);
            return updatedMap;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token, map]);

    // Fetch de todos los templates
    const fetchTemplates = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/templates', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching templates');
            const data = await response.json();
            setTemplates(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Crear nuevo template
    const createTemplate = useCallback(async (templateData) => {
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/templates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(templateData)
            });
            if (!response.ok) throw new Error('Error creating template');
            const newTemplate = await response.json();
            setTemplates(prev => [...prev, newTemplate]);
            return newTemplate;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    // Actualizar template existente
    const updateTemplate = useCallback(async (templateId, templateData) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/templates/${templateId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(templateData)
            });
            if (!response.ok) throw new Error('Error updating template');
            const updatedTemplate = await response.json();
            setTemplates(prev => prev.map(t => t.id === templateId ? updatedTemplate : t));
            return updatedTemplate;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    // Eliminar template
    const deleteTemplate = useCallback(async (templateId) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/templates/${templateId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error deleting template');
            setTemplates(prev => prev.filter(t => t.id !== templateId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    // Obtener template para un turno específico
    const getTemplateForShift = useCallback(async (date, type) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/templates/shift?date=${date}&type=${type}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching shift template');
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const value = {
        map,
        templates,
        loading,
        error,
        fetchMap,
        updateMap,
        fetchTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        getTemplateForShift
    };

    return (
        <MapContext.Provider value={value}>
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
