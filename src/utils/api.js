const API_BASE_URL = 'http://localhost:8000/api';

let authToken = localStorage.getItem('authToken');

export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken')
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    })

    if (!response.ok) {
      const data = await response.json()
      
      if (response.status === 422) {
        const error = new Error('Validation failed')
        error.validationErrors = data.errors
        throw error
      }
      
      throw new Error(data.message || 'An error occurred')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
