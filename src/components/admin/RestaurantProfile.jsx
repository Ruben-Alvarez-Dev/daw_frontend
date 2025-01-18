import { useState, useEffect } from 'react';
import { useRestaurantConfig } from '../../context/RestaurantConfigContext';
import './RestaurantProfile.css';

export default function RestaurantProfile() {
  const { config, updateConfig } = useRestaurantConfig();
  const [localConfig, setLocalConfig] = useState(config);
  const [error, setError] = useState('');

  // Actualizar localConfig cuando config cambie (por ejemplo, al cargar inicialmente)
  useEffect(() => {
    setLocalConfig(config);
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
            onChange={(e) => setLocalConfig(prev => ({
              ...prev,
              totalCapacity: e.target.value ? parseInt(e.target.value) : ''
            }))}
            min="0"
            required
          />
          <small>Suma de la capacidad de todas las mesas</small>
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

        <div className="time-section">
          <h3>Horario de Tarde</h3>
          <div className="time-group">
            <div className="form-group">
              <label>Hora de Apertura</label>
              <input
                type="time"
                value={localConfig.openingHours.afternoon.open}
                onChange={(e) => handleTimeChange('afternoon', 'open', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Cierre</label>
              <input
                type="time"
                value={localConfig.openingHours.afternoon.close}
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
                value={localConfig.openingHours.evening.open}
                onChange={(e) => handleTimeChange('evening', 'open', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Hora de Cierre</label>
              <input
                type="time"
                value={localConfig.openingHours.evening.close}
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
