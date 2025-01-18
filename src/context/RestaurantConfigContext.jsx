import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const defaultConfig = {
  totalCapacity: 0,
  timeEstimateSmall: 60,
  timeEstimateLarge: 90,
  openingHours: {
    afternoon: {
      open: "13:00",
      close: "16:00"
    },
    evening: {
      open: "20:00",
      close: "23:30"
    }
  }
};

const RestaurantConfigContext = createContext();

export function RestaurantConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Cargar configuración al montar el componente si hay token
  useEffect(() => {
    if (token) {
      fetchConfig();
    }
  }, [token]);

  const fetchConfig = async () => {
    if (!token) {
      setError('Usuario no autenticado');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar la configuración');
      }
      
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig) => {
    if (!token) {
      setError('Usuario no autenticado');
      return false;
    }

    if (!isAdmin) {
      setError('No tienes permisos para modificar la configuración');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }
      
      setConfig(newConfig);
      return true;
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    config,
    loading,
    error,
    fetchConfig,
    updateConfig,
    isAdmin,
    defaultConfig
  };

  return (
    <RestaurantConfigContext.Provider value={value}>
      {children}
    </RestaurantConfigContext.Provider>
  );
}

export function useRestaurantConfig() {
  const context = useContext(RestaurantConfigContext);
  if (!context) {
    throw new Error('useRestaurantConfig debe usarse dentro de RestaurantConfigProvider');
  }
  return context;
}
