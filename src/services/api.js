const API_URL = import.meta.env.VITE_API_URL;

// Auth services
export const login = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/api/login`, {
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
        const response = await fetch(`${API_URL}/api/register`, {
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
        const response = await fetch(`${API_URL}/api/restaurants`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
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
        const response = await fetch(`${API_URL}/api/restaurants`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${id}`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/tables`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/tables/${tableId}`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/tables`, {
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
        const response = await fetch(`${API_URL}/api/restaurants/${restaurantId}/tables/${tableId}`, {
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
        const response = await fetch(`${API_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `Error HTTP: ${response.status}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

export const getUser = async (token, id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
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
        const response = await fetch(`${API_URL}/api/users`, {
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
        console.log('Enviando actualización de usuario:', {
            url: `${API_URL}/api/users/${id}`,
            method: 'PATCH',
            data
        });

        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(data),
        });

        // Si la respuesta no es ok, intentamos obtener el mensaje de error
        if (!response.ok) {
            let errorMessage = 'Error al actualizar el usuario';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                console.error('Error al parsear respuesta de error:', e);
            }
            throw new Error(errorMessage);
        }

        // Solo intentamos parsear como JSON si la respuesta fue exitosa
        try {
            const result = await response.json();
            return result;
        } catch (e) {
            console.error('Error al parsear respuesta exitosa:', e);
            return null; // Retornamos null si no hay datos pero la operación fue exitosa
        }
    } catch (error) {
        console.error('Error completo al actualizar usuario:', error);
        throw error;
    }
};

export const deleteUser = async (token, id) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar el usuario');
        }
        
        return response;
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};
