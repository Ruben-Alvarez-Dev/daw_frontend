import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api/auth';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar sesión al inicio
    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {
                const user = await authService.profile(savedToken);
                setUser(user);
                setToken(savedToken);
            } catch (error) {
                console.error('Error verificando sesión:', error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (identifier, password) => {
        try {
            setLoading(true);
            const { user: newUser, token: newToken } = await authService.login(identifier, password);
            setUser(newUser);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a que el estado se actualice
            return { user: newUser, token: newToken };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const { user: newUser, token: newToken } = await authService.register(userData);
            setUser(newUser);
            setToken(newToken);
            localStorage.setItem('token', newToken);
            await new Promise(resolve => setTimeout(resolve, 0)); // Esperar a que el estado se actualice
            return { user: newUser, token: newToken };
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                await authService.logout(token);
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            setLoading(false);
        }
    };

    const isAdmin = () => user?.role === 'admin';
    const isCustomer = () => user?.role === 'customer';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            isAdmin,
            isCustomer
        }}>
            {children}
        </AuthContext.Provider>
    );
}
