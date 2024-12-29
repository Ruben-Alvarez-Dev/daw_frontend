import { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (credentials) => {
        try {
            const response = await loginApi(credentials);
            const { user: userData, authorization } = response;
            
            setUser(userData);
            setToken(authorization.token);
            
            return userData;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerApi(userData);
            const { user: newUser, authorization } = response;
            
            setUser(newUser);
            setToken(authorization.token);
            
            return newUser;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            register,
            logout
        }}>
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
