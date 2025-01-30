import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ConfigurationProvider, useConfiguration } from '../context/ConfigurationContext';

// Este componente gestiona los efectos secundarios de la autenticación
function AuthManager({ children }) {
    const { token } = useAuth();
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
        <ConfigurationProvider>
            <AuthProvider>
                <AuthManager>
                    {children}
                </AuthManager>
            </AuthProvider>
        </ConfigurationProvider>
    );
}
