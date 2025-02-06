import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const defaultSettings = {
  totalCapacity: 0,
  timeEstimateSmall: 60, // tiempo en minutos para mesas ≤ 6
  timeEstimateLarge: 90,  // tiempo en minutos para mesas > 6
  tables: []
};

export function useRestaurantSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const { token } = useAuth();

  // Cargar configuración al montar el componente
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las mesas');
        }

        const tables = await response.json();
        setSettings(prev => ({
          ...prev,
          tables
        }));
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, [token]);

  // Función para actualizar configuración
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
  };

  return {
    settings,
    updateSettings,
    defaultSettings
  };
}
