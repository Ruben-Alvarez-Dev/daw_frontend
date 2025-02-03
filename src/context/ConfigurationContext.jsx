import { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_URL, getHeaders, handleResponse } from '../services/api/config';

const ConfigurationContext = createContext();

export function useConfiguration() {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error('useConfiguration must be used within a ConfigurationProvider');
    }
    return context;
}

export function ConfigurationProvider({ children }) {
    const { token } = useAuth();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadConfig = useCallback(async () => {
        console.log('loadConfig called with token:', token);
        if (!token) {
            console.log('No token available, skipping loadConfig');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching config from:', `${API_URL}/api/config`);
            const response = await fetch(`${API_URL}/api/config`, {
                headers: getHeaders(token)
            });

            const data = await handleResponse(response);
            console.log('Config loaded:', data);
            setConfig(data);
        } catch (err) {
            console.error('Error loading configuration:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const updateConfig = async (newConfig) => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/config`, {
                method: 'PUT',
                headers: getHeaders(token),
                body: JSON.stringify(newConfig)
            });

            await handleResponse(response);
            
            // Recargar la configuración después de actualizar
            await loadConfig();
            return true;
        } catch (err) {
            console.error('Error updating configuration:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const restoreDefaults = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/config/restore`, {
                method: 'POST',
                headers: getHeaders(token)
            });

            await handleResponse(response);
            
            // Recargar la configuración después de restaurar
            await loadConfig();
            return true;
        } catch (err) {
            console.error('Error restoring configuration:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Log when provider is rendered
    console.log('ConfigurationProvider rendered with token:', token);

    const value = {
        config,
        loading,
        error,
        loadConfig,
        updateConfig,
        restoreDefaults
    };

    return (
        <ConfigurationContext.Provider value={value}>
            {children}
        </ConfigurationContext.Provider>
    );
}
