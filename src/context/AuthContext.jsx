import { createContext, useContext, useState } from 'react';
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
    const [loading, setLoading] = useState(false);

    const login = async (identifier, password) => {
        try {
            setLoading(true);
            const { user: newUser, token: newToken } = await authService.login(identifier, password);
            setUser(newUser);
            setToken(newToken);
            return { user: newUser, token: newToken };
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await authService.logout(token);
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setUser(null);
            setToken(null);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
