const API_URL = import.meta.env.VITE_API_URL;

// Auth services
export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
        throw new Error('Error en el login');
    }
    
    return response.json();
};

export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
        throw new Error('Error en el registro');
    }
    
    return response.json();
};

// Restaurant services
export const getRestaurants = async (token) => {
    const response = await fetch(`${API_URL}/restaurants`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener restaurantes');
    }
    
    return response.json();
};

export const getRestaurant = async (token, id) => {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener el restaurante');
    }
    
    return response.json();
};

export const createRestaurant = async (token, data) => {
    const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al crear el restaurante');
    }
    
    return response.json();
};

export const updateRestaurant = async (token, id, data) => {
    const response = await fetch(`${API_URL}/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al actualizar el restaurante');
    }
    
    return response.json();
};

// Table services
export const getTables = async (token, restaurantId) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener las mesas');
    }
    
    return response.json();
};

export const getTable = async (token, restaurantId, tableId) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables/${tableId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener la mesa');
    }
    
    return response.json();
};

export const createTable = async (token, restaurantId, data) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al crear la mesa');
    }
    
    return response.json();
};

export const updateTable = async (token, restaurantId, tableId, data) => {
    const response = await fetch(`${API_URL}/restaurants/${restaurantId}/tables/${tableId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al actualizar la mesa');
    }
    
    return response.json();
};

// User services
export const getUsers = async (token) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }
    
    return response.json();
};

export const getUser = async (token, id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Error al obtener el usuario');
    }
    
    return response.json();
};

export const createUser = async (token, data) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al crear el usuario');
    }
    
    return response.json();
};

export const updateUser = async (token, id, data) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    
    if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
    }
    
    return response.json();
};
