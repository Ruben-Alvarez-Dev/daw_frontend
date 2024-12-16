import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL, AUTH_ENDPOINTS } from '../../config/config'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // Inicializar estado desde localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')
        
        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
        
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        try {
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(credentials)
            })

            if (!response.ok) {
                throw new Error('Error en la autenticación')
            }

            const data = await response.json()
            
            // Guardar en localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            // Actualizar estado
            setToken(data.token)
            setUser(data.user)
            setIsAuthenticated(true)
            
            return { success: true, data }
        } catch (error) {
            console.error('Error durante login:', error)
            return { success: false, error: error.message }
        }
    }

    const refreshToken = async () => {
        try {
            console.log('Intentando refrescar token...') 
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REFRESH}`, {
                method: 'GET', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Error al refrescar el token')
            }

            const data = await response.json()
            console.log('Token refrescado:', data) 
            
            // Guardar nuevo token en localStorage
            localStorage.setItem('token', data.token)
            
            // Actualizar estado
            setToken(data.token)
            
            return { success: true, data }
        } catch (error) {
            console.error('Error al refrescar el token:', error)
            return { success: false, error: error.message }
        }
    }

    const clearAuthState = () => {
        // Limpiar localStorage
        localStorage.clear()
        
        // Resetear estados
        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
    }

    const logout = async () => {
        try {
            if (token) {
                await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
            }
        } catch (error) {
            console.error('Error durante logout:', error)
        } finally {
            clearAuthState()
            window.location.replace('/login')
        }
    }

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error en el registro')
            }

            const data = await response.json()
            return { success: true, data }
        } catch (error) {
            console.error('Error durante registro:', error)
            return { success: false, error: error.message }
        }
    }

    const value = {
        isAuthenticated,
        user,
        token,
        login,
        logout,
        register,
        refreshToken,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

export default AuthContext
