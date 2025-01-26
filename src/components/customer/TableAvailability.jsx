import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './TableAvailability.css';

export default function TableAvailability({ onTableSelect }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [availableTables, setAvailableTables] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (selectedDate && selectedTime && guests > 0) {
      fetchAvailableTables();
    }
  }, [selectedDate, selectedTime, guests]);

  const fetchAvailableTables = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tables/available?` + 
        new URLSearchParams({
          date: selectedDate,
          time: selectedTime,
          guests: guests
        }), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener las mesas disponibles');
      }

      const data = await response.json();
      setAvailableTables(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las mesas disponibles');
      console.error('Error fetching available tables:', err);
    }
  };

  const handleTableSelect = (table) => {
    if (onTableSelect) {
      onTableSelect({
        table,
        date: selectedDate,
        time: selectedTime,
        guests
      });
    }
  };

  return (
    <div className="availability">
      <div className="availability__filters">
        <div className="availability__filter-group">
          <label className="availability__label">Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="availability__input"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="availability__filter-group">
          <label className="availability__label">Hora</label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="availability__input"
            required
          >
            <option value="">Selecciona una hora</option>
            <option value="13:00">13:00</option>
            <option value="13:30">13:30</option>
            <option value="14:00">14:00</option>
            <option value="14:30">14:30</option>
            <option value="20:00">20:00</option>
            <option value="20:30">20:30</option>
            <option value="21:00">21:00</option>
            <option value="21:30">21:30</option>
          </select>
        </div>

        <div className="availability__filter-group">
          <label className="availability__label">Comensales</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="availability__input"
            min="1"
            max="10"
            required
          />
        </div>
      </div>

      {error && (
        <div className="availability__error">
          {error}
        </div>
      )}

      <div className="availability__tables">
        {availableTables.length === 0 ? (
          <p className="availability__empty">
            {selectedDate && selectedTime 
              ? 'No hay mesas disponibles para los criterios seleccionados'
              : 'Selecciona fecha y hora para ver las mesas disponibles'}
          </p>
        ) : (
          <div className="availability__grid">
            {availableTables.map(table => (
              <button
                key={table.id}
                onClick={() => handleTableSelect(table)}
                className={`availability__table ${
                  table.capacity >= guests ? 'availability__table--suitable' : 'availability__table--unsuitable'
                }`}
                disabled={table.capacity < guests}
              >
                <span className="availability__table-number">Mesa {table.number}</span>
                <span className="availability__table-capacity">{table.capacity} personas</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
