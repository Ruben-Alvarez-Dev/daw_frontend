import { useState, useEffect } from 'react';
import { useConfiguration } from '../../context/ConfigurationContext';
import './RestaurantProfile.css';

const defaultConfig = {
  totalCapacity: 0,
  timeEstimateSmall: 60,
  timeEstimateLarge: 90,
  timeInterval: 15,
  simultaneousTables: 2,
  openingHours: {
    afternoon: {
      open: '13:00',
      close: '16:00'
    },
    evening: {
      open: '20:00',
      close: '23:30'
    }
  }
};

export default function RestaurantProfile() {
  const { config, updateConfig, loading } = useConfiguration();
  const [localConfig, setLocalConfig] = useState(defaultConfig);
  const [error, setError] = useState('');

  // Actualizar localConfig cuando config cambie (por ejemplo, al cargar inicialmente)
  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await updateConfig(localConfig);
      if (success) {
        setError('');
      } else {
        setError('Error al guardar la configuración');
      }
    } catch (err) {
      setError('Error al guardar la configuración');
    }
  };

  const handleTimeChange = (period, type, value) => {
    setLocalConfig(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [period]: {
          ...prev.openingHours[period],
          [type]: value
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="restaurant-profile">
        <h2>Configuración del Restaurante</h2>
        <div className="loading">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="restaurant-profile">
      <h2>Configuración del Restaurante</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Capacidad Total del Restaurante</label>
          <input
            type="number"
            value={localConfig.totalCapacity}
            readOnly
            disabled
          />
          <small>Suma automática de la capacidad de todas las mesas</small>
        </div>

        <div className="form-group">
          <label>Tiempo Estimado para Mesas ≤ 6 personas (minutos)</label>
          <input
            type="number"
            value={localConfig.timeEstimateSmall}
            onChange={(e) => setLocalConfig(prev => ({
              ...prev,
              timeEstimateSmall: e.target.value ? parseInt(e.target.value) : ''
            }))}
            min="30"
            required
          />
          <small>Tiempo medio de ocupación para grupos pequeños</small>
        </div>

        <div className="form-group">
          <label>Tiempo Estimado para Mesas > 6 personas (minutos)</label>
          <input
            type="number"
            value={localConfig.timeEstimateLarge}
            onChange={(e) => setLocalConfig(prev => ({
              ...prev,
              timeEstimateLarge: e.target.value ? parseInt(e.target.value) : ''
            }))}
            min="30"
            required
          />
          <small>Tiempo medio de ocupación para grupos grandes</small>
        </div>

        <div className="form-group">
          <label>Intervalo entre Mesas (minutos)</label>
          <input
            type="number"
            value={localConfig.timeInterval}
            onChange={(e) => setLocalConfig(prev => ({
              ...prev,
              timeInterval: e.target.value ? parseInt(e.target.value) : ''
            }))}
            min="5"
            required
          />
          <small>Tiempo entre franjas horarias para reservas</small>
        </div>

        <div className="form-group">
          <label>Entrada de Mesas Simultáneas</label>
          <input
            type="number"
            value={localConfig.simultaneousTables}
            onChange={(e) => setLocalConfig(prev => ({
              ...prev,
              simultaneousTables: e.target.value ? parseInt(e.target.value) : ''
            }))}
            min="1"
            required
          />
          <small>Número de mesas que pueden entrar en el mismo horario</small>
        </div>

        <div className="time-section">
          <h3>Horario de Tarde</h3>
          <div className="time-group">
            <div className="form-group">
              <label>Hora de Apertura</label>
              <input
                type="time"
                value={localConfig.openingHours?.afternoon?.open || '13:00'}
                onChange={(e) => handleTimeChange('afternoon', 'open', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Cierre</label>
              <input
                type="time"
                value={localConfig.openingHours?.afternoon?.close || '16:00'}
                onChange={(e) => handleTimeChange('afternoon', 'close', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="time-section">
          <h3>Horario de Noche</h3>
          <div className="time-group">
            <div className="form-group">
              <label>Hora de Apertura</label>
              <input
                type="time"
                value={localConfig.openingHours?.evening?.open || '20:00'}
                onChange={(e) => handleTimeChange('evening', 'open', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Cierre</label>
              <input
                type="time"
                value={localConfig.openingHours?.evening?.close || '23:30'}
                onChange={(e) => handleTimeChange('evening', 'close', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Guardar Configuración
        </button>
      </form>
    </div>
  );
}
