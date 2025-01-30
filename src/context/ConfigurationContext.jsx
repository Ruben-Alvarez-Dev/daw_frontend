import { createContext, useContext, useState } from 'react';
import { API_URL, getHeaders, handleResponse } from '../services/api/config';

const defaultConfig = {
    totalCapacity: 0,
    timeEstimateSmall: 60,
    timeEstimateLarge: 90,
    timeInterval: 15,
    simultaneousTables: 2,
    openingHours: {
        afternoon: {
            open: "13:00",
            close: "16:00"
        },
        evening: {
            open: "20:00",
            close: "23:30"
        }
    }
};

const ConfigurationContext = createContext();

export function useConfiguration() {
    const context = useContext(ConfigurationContext);
    if (!context) {
        throw new Error('useConfiguration must be used within a ConfigurationProvider');
    }
    return context;
}

export function ConfigurationProvider({ children }) {
    const [config, setConfig] = useState(defaultConfig);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadConfig = async (token) => {
        if (!token) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${API_URL}/api/config`, {
                headers: getHeaders(token)
            });

            const data = await handleResponse(response);
            setConfig({ ...defaultConfig, ...data });
        } catch (err) {
            console.error('Error loading configuration:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetConfig = () => {
        setConfig(defaultConfig);
        setError(null);
        setLoading(false);
    };

    return (
        <ConfigurationContext.Provider value={{
            config,
            loading,
            error,
            loadConfig,
            resetConfig
        }}>
            {children}
        </ConfigurationContext.Provider>
    );
}
