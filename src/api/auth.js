const API_URL = 'http://localhost:8000/api';

export async function loginRequest(userData) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
}

export async function registerRequest(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse');
    }

    return data;
}

export async function logoutRequest(token) {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al cerrar sesión');
    }

    return data;
}
