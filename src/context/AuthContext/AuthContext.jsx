import { createContext, useState, useContext } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const register = async (userData) => {
    try {
      console.log('Enviando datos de registro:', userData);
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(userData)
      });

      console.log('Respuesta del servidor:', response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API no encontrada. Verifica que el servidor esté corriendo.');
        }
        const errorData = await response.json().catch(() => ({
          message: 'Error en el formato de respuesta del servidor'
        }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!data.status) {
        throw new Error(data.message || 'Error en el registro');
      }

      // Iniciar sesión automáticamente después del registro
      const loginResult = await login({
        email: userData.email,
        password: userData.password
      });

      if (!loginResult.success) {
        throw new Error('Error al iniciar sesión automáticamente después del registro');
      }

      return { success: true };
    } catch (error) {
      console.error('Error completo:', error);
      return { 
        success: false, 
        error: error.message || 'Error desconocido en el registro'
      };
    }
  };

  const login = async (credentials) => {
    try {
      console.log('Enviando credenciales:', credentials);
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Respuesta del servidor:', response);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API no encontrada. Verifica que el servidor esté corriendo.');
        }
        const errorData = await response.json().catch(() => ({
          message: 'Error en el formato de respuesta del servidor'
        }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!data.status) {
        throw new Error(data.message || 'Credenciales inválidas');
      }

      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Error completo:', error);
      return { 
        success: false, 
        error: error.message || 'Error desconocido en el login'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};