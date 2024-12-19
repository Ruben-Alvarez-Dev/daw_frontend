import { API_URL } from '../config/config'

const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error en la petición')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : (data.data || [])
}

const createApiRequest = (token) => async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    return await handleResponse(response)
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      throw error
    }
    console.error(`API Error (${endpoint}):`, error)
    throw new Error('Error al conectar con el servidor')
  }
}

// Users API
export const fetchUsers = (token) => {
  const apiRequest = createApiRequest(token)
  return apiRequest('/users')
}

// Restaurants API
export const fetchRestaurants = (token) => {
  const apiRequest = createApiRequest(token)
  return apiRequest('/restaurants')
}

// Tables API
export const fetchTables = (token) => {
  const apiRequest = createApiRequest(token)
  return apiRequest('/tables')
}

// Reservations API
export const fetchReservations = (token) => {
  const apiRequest = createApiRequest(token)
  return apiRequest('/reservations')
}

// Create functions
export const createItem = (token, endpoint, data) => {
  const apiRequest = createApiRequest(token)
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// Update functions
export const updateItem = (token, endpoint, id, data) => {
  const apiRequest = createApiRequest(token)
  return apiRequest(`${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// Delete functions
export const deleteItem = (token, endpoint, id) => {
  const apiRequest = createApiRequest(token)
  return apiRequest(`${endpoint}/${id}`, {
    method: 'DELETE'
  })
}
