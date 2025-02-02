import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useConfiguration } from '../../../context/ConfigurationContext';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import TimeSlotGrid from '../TimeSlotGrid';
import "react-datepicker/dist/react-datepicker.css";
import './AdminAssignation.css';

// Registrar el locale español
registerLocale('es', es);

export default function AdminAssignation() {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const { token } = useAuth();
  const { config } = useConfiguration();

  useEffect(() => {
    fetchReservations();
    // TODO: Implementar carga de mesas cuando tengamos el contexto apropiado
    setTables([]);
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Formatear la fecha para la API: YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const url = `${import.meta.env.VITE_API_URL}/api/reservations/date/${formattedDate}`;
      
      console.log('Fetching reservations from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received reservations:', data);
      
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Error al cargar las reservas. Por favor, inténtelo de nuevo.');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTime(time);
  };

  const getAvailableTables = () => {
    if (!selectedTime) return [];

    const reservationsAtTime = reservations.filter(
      reservation => reservation.time === selectedTime
    );

    const reservedTableIds = reservationsAtTime.reduce((acc, res) => {
      return [...acc, ...(res.tables_ids || [])];
    }, []);

    return tables.filter(table => !reservedTableIds.includes(table.id));
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options).replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <div className="date-picker-container mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-blue-300">
            {formatDate(selectedDate)}
          </h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            locale="es"
            className="date-picker-input"
            calendarClassName="date-picker-calendar"
            monthsShown={1}
            showPopperArrow={false}
            placeholderText="Seleccionar fecha"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Selecciona un horario para ver las mesas disponibles.
        </p>
        <p className="text-gray-400 text-sm">
          El número entre paréntesis indica los espacios disponibles en cada franja horaria.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Cargando reservas...</p>
        </div>
      ) : (
        <TimeSlotGrid
          onSelectTimeSlot={handleTimeSlotSelect}
          selectedTime={selectedTime}
          reservations={reservations}
        />
      )}

      {selectedTime && !loading && (
        <div className="mt-8 bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-blue-300">
            Mesas disponibles para las {selectedTime}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {getAvailableTables().map((table) => (
              <div
                key={table.id}
                className="bg-gray-600 p-4 rounded-lg hover:bg-gray-500 cursor-pointer transition-colors"
              >
                <div className="font-medium text-white">Mesa {table.number}</div>
                <div className="text-sm text-gray-300">
                  Capacidad: {table.capacity} personas
                </div>
              </div>
            ))}
          </div>
          {getAvailableTables().length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No hay mesas disponibles para este horario
            </p>
          )}
        </div>
      )}
    </div>
  );
}
