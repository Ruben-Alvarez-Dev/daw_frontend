const API_URL = import.meta.env.VITE_API_URL;

// Auth services
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el login');
        }
        
        return data;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
        }
        
        return data;
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
};

// Restaurant services
export const getRestaurants = async (token) => {
    try {
        const response = await fetch(`${API_URL}/restaurants`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener restaurantes');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener restaurantes:', error);
        throw error;
    }
};

export const getRestaurant = async (token, id) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el restaurante');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener el restaurante:', error);
        throw error;
    }
};

export const createRestaurant = async (token, data) => {
    try {
        const response = await fetch(`${API_URL}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al crear el restaurante');
        }
        
        return result;
    } catch (error) {
        console.error('Error al crear el restaurante:', error);
        throw error;
    }
};

export const updateRestaurant = async (token, id, data) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al actualizar el restaurante');
        }
        
        return result;
    } catch (error) {
        console.error('Error al actualizar el restaurante:', error);
        throw error;
    }
};

// Table services
export const getTables = async (token, restaurantId) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener las mesas');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener las mesas:', error);
        throw error;
    }
};

export const getTable = async (token, restaurantId, tableId) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables/${tableId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener la mesa');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener la mesa:', error);
        throw error;
    }
};

export const createTable = async (token, restaurantId, data) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al crear la mesa');
        }
        
        return result;
    } catch (error) {
        console.error('Error al crear la mesa:', error);
        throw error;
    }
};

export const updateTable = async (token, restaurantId, tableId, data) => {
    try {
        const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables/${tableId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al actualizar la mesa');
        }
        
        return result;
    } catch (error) {
        console.error('Error al actualizar la mesa:', error);
        throw error;
    }
};

// User services
export const getUsers = async (token) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuarios');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

export const getUser = async (token, id) => {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener el usuario');
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
};

export const createUser = async (token, data) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al crear el usuario');
        }
        
        return result;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

export const updateUser = async (token, id, data) => {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Error al actualizar el usuario');
        }
        
        return result;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};
