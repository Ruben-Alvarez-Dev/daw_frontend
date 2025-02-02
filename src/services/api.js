const API_URL = import.meta.env.VITE_API_URL;

// Generic API call function with auth
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};

// Users API
export const userApi = {
    getAll: () => apiCall('/users'),
    getById: (id) => apiCall(`/users/${id}`),
    create: (userData) => apiCall('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    update: (id, userData) => apiCall(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    }),
    delete: (id) => apiCall(`/users/${id}`, {
        method: 'DELETE'
    })
};

// Tables API
export const tableApi = {
    getAll: () => apiCall('/tables'),
    getById: (id) => apiCall(`/tables/${id}`),
    create: (tableData) => apiCall('/tables', {
        method: 'POST',
        body: JSON.stringify(tableData)
    }),
    update: (id, tableData) => apiCall(`/tables/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tableData)
    }),
    delete: (id) => apiCall(`/tables/${id}`, {
        method: 'DELETE'
    })
};

// Reservations API
export const reservationApi = {
    getAll: () => apiCall('/reservations'),
    getById: (id) => apiCall(`/reservations/${id}`),
    create: (reservationData) => apiCall('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservationData)
    }),
    update: (id, reservationData) => apiCall(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reservationData)
    }),
    delete: (id) => apiCall(`/reservations/${id}`, {
        method: 'DELETE'
    })
};
