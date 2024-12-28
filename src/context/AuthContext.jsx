import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    const login = async (credentials) => {
        try {
            const response = await loginApi(credentials);
            const { user: userData, token: authToken } = response;
            
            setUser(userData);
            setToken(authToken);
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', authToken);
            
            return userData;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerApi(userData);
            const { user: newUser, token: authToken } = response;
            
            setUser(newUser);
            setToken(authToken);
            
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('token', authToken);
            
            return newUser;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        getToken: () => token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
