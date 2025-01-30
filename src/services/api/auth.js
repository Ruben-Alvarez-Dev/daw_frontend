import { API_URL, handleResponse, getHeaders } from './config';

export const authService = {
    login: async (identifier, password) => {
        const isEmail = identifier.includes('@');
        const endpoint = `${API_URL}/api/login/${isEmail ? 'email' : 'phone'}`;
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                [isEmail ? 'email' : 'phone']: identifier,
                password
            })
        });

        const data = await handleResponse(response);
        
        if (data.status !== 'success' || !data.user || !data.authorisation) {
            throw new Error(data.message || 'Respuesta de autenticación inválida');
        }

        return {
            user: data.user,
            token: data.authorisation.token
        };
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: userData.password,
                password_confirmation: userData.password
            })
        });

        const data = await handleResponse(response);
        
        if (data.status !== 'success') {
            throw new Error(data.message || 'Error en el registro');
        }

        return {
            user: data.user,
            token: data.authorisation.token
        };
    },

    logout: async (token) => {
        const response = await fetch(`${API_URL}/api/logout`, {
            method: 'POST',
            headers: getHeaders(token)
        });

        return handleResponse(response);
    },

    refresh: async (token) => {
        const response = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            headers: getHeaders(token)
        });

        const data = await handleResponse(response);
        
        if (data.status !== 'success') {
            throw new Error(data.message || 'Error al refrescar el token');
        }

        return {
            user: data.user,
            token: data.authorisation.token
        };
    },

    profile: async (token) => {
        const response = await fetch(`${API_URL}/api/profile`, {
            headers: getHeaders(token)
        });

        const data = await handleResponse(response);
        return data.user;
    }
};
