import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const defaultConfig = {
  totalCapacity: 0,
  timeEstimateSmall: 60,
  timeEstimateLarge: 90,
  timeInterval: 15,
  simultaneousTables: 2,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  const isAdmin = user?.role === 'admin';

  // Cargar configuración al montar el componente si hay token
  useEffect(() => {
    if (token) {
      fetchConfig();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchConfig = async () => {
    if (!token) {
      setError('Usuario no autenticado');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching restaurant config...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching config:', errorText);
        throw new Error('Error al cargar la configuración');
      }

      const data = await response.json();
      console.log('Received config:', data);
      
      // Asegurarse de que la configuración tiene todos los campos necesarios
      const newConfig = {
        ...defaultConfig,
        ...data
      };
      
      setConfig(newConfig);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig) => {
    if (!token || !isAdmin) {
      setError('No autorizado');
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la configuración');
      }

      setConfig(newConfig);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestaurantConfigContext.Provider value={{ config, loading, error, updateConfig, fetchConfig }}>
      {children}
    </RestaurantConfigContext.Provider>
  );
}

export function useRestaurantConfig() {
  const context = useContext(RestaurantConfigContext);
  if (!context) {
    throw new Error('useRestaurantConfig debe usarse dentro de un RestaurantConfigProvider');
  }
  return context;
}
