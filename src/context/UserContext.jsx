import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    const fetchUsers = useCallback(async (showInactive = false) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/users?show_inactive=${showInactive}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching users');
            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const createUser = useCallback(async (userData) => {
        if (!token) return;
        try {
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Error creating user');
            }
            
            const newUser = await response.json();
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const updateUser = useCallback(async (id, userData) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors ? Object.values(errorData.errors).join(', ') : 'Error updating user');
            }

            const updatedUser = await response.json();
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
            return updatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const deactivateUser = useCallback(async (id) => {
        if (!token) return;
        try {
            const response = await fetch(`http://localhost:8000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error deactivating user');
            }

            const data = await response.json();
            setUsers(prev => prev.map(user => user.id === id ? data.user : user));
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [token]);

    const value = {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deactivateUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
