import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigurationProvider } from '../context/ConfigurationContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { DashboardProvider } from '../context/DashboardContext';

// Este componente gestiona los efectos secundarios de la autenticación
function AuthManager({ children, token }) {
    const { loadConfig, resetConfig } = useConfiguration();
    const [configLoaded, setConfigLoaded] = useState(false);

    useEffect(() => {
        const handleConfig = async () => {
            if (token && !configLoaded) {
                try {
                    await loadConfig(token);
                    setConfigLoaded(true);
                } catch (error) {
                    console.error('Error loading config:', error);
                }
            } else if (!token && configLoaded) {
                resetConfig();
                setConfigLoaded(false);
            }
        };

        handleConfig();
    }, [token, loadConfig, resetConfig, configLoaded]);

    return children;
}

// Este es el provider principal que configura todos los contextos
export default function AppProvider({ children }) {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AuthConsumer>
                    {(token) => (
                        <ConfigurationProvider token={token}>
                            <AuthManager token={token}>
                                <DashboardProvider>
                                    {children}
                                </DashboardProvider>
                            </AuthManager>
                        </ConfigurationProvider>
                    )}
                </AuthConsumer>
            </AuthProvider>
        </BrowserRouter>
    );
}

function AuthConsumer({ children }) {
    const { token } = useAuth();
    return children(token);
}
