import { useState, useEffect } from 'react';

const defaultSettings = {
  totalCapacity: 0,
  timeEstimateSmall: 60, // tiempo en minutos para mesas ≤ 6
  timeEstimateLarge: 90  // tiempo en minutos para mesas > 6
};

export function useRestaurantSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  // Cargar configuración al montar el componente
  useEffect(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Función para actualizar configuración
  const updateSettings = (newSettings) => {
    const updatedSettings = { ...settings, ...newSettings };
    localStorage.setItem('restaurantSettings', JSON.stringify(updatedSettings));
    setSettings(updatedSettings);
  };

  return {
    settings,
    updateSettings,
    defaultSettings
  };
}
