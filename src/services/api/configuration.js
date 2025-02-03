import { API_URL, handleResponse, getHeaders } from './config';

export const configurationService = {
    getConfiguration: async (token) => {
        const response = await fetch(`${API_URL}/api/config`, {
            headers: getHeaders(token)
        });
        return handleResponse(response);
    },

    updateConfiguration: async (token, data) => {
        const response = await fetch(`${API_URL}/api/config`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    restoreDefaults: async (token) => {
        const response = await fetch(`${API_URL}/api/config/restore`, {
            method: 'POST',
            headers: getHeaders(token)
        });
        return handleResponse(response);
    }
};
