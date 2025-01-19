import { useState, useEffect } from 'react';
import { useTables } from '../../context/TablesContext';
import { useAuth } from '../../context/AuthContext';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import ReservationItem from './ReservationItem';
import "react-datepicker/dist/react-datepicker.css";
import './AdminDistribution.css';

registerLocale('es', es);

export default function AdminDistribution() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState({
    afternoon: [],
    evening: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);
  const { tables } = useTables();
  const { token } = useAuth();

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations/date/${formattedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar las reservas');
      }

      const data = await response.json();
      
      const afternoonReservations = data.filter(r => {
        const hour = parseInt(r.time.split(':')[0]);
        return hour >= 13 && hour < 16;
      });
      
      const eveningReservations = data.filter(r => {
        const hour = parseInt(r.time.split(':')[0]);
        return hour >= 20 && hour < 23;
      });

      setReservations({
        afternoon: afternoonReservations,
        evening: eveningReservations
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation.id === selectedReservation?.id ? null : reservation);
    setSelectedTables([]);
  };

  const handleTableClick = async (table) => {
    if (!selectedReservation) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/reservations/${selectedReservation.id}/tables`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ table_ids: [table.id] })
        }
      );

      if (!response.ok) {
        throw new Error('Error al asignar mesa');
      }

      await fetchReservations();
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error al asignar mesa:', error);
      setError('Error al asignar mesa a la reserva');
    }
  };

  const renderTableGrid = (tables) => (
    <div className="distribution-tables">
      {tables.map((table) => (
        <div 
          key={table.id} 
          className={`distribution-table ${selectedTables.includes(table.id) ? 'selected' : ''}`}
          onClick={() => handleTableClick(table)}
        >
          <div className="distribution-table-content">
            <div className="distribution-table-number">Mesa {table.number}</div>
            <div className="distribution-table-capacity">{table.capacity} pax</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReservationList = (reservationList) => (
    <div className="distribution-list">
      {reservationList.map((reservation) => (
        <ReservationItem 
          key={reservation.id} 
          reservation={reservation}
          selected={selectedReservation?.id === reservation.id}
          onClick={() => handleReservationClick(reservation)}
        />
      ))}
      {reservationList.length === 0 && (
        <p className="distribution-empty">No hay reservas</p>
      )}
    </div>
  );

  return (
    <div className="distribution-container">
      <div className="distribution-datepicker">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          locale="es"
          className="date-picker-input"
          calendarClassName="date-picker-calendar"
        />
      </div>

      {error && (
        <div className="distribution-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="distribution-loading">
          Cargando...
        </div>
      ) : (
        <div className="distribution-panels">
          <div className="distribution-panel">
            <h3 className="distribution-panel-title">Distribución Comidas</h3>
            <div className="distribution-panel-content">
              <div className="distribution-section">
                <h4 className="distribution-section-title">Reservas Pendientes</h4>
                {renderReservationList(reservations.afternoon)}
              </div>
              
              <div className="distribution-section">
                <h4 className="distribution-section-title">Distribución de Mesas</h4>
                {renderTableGrid(tables)}
              </div>
            </div>
          </div>

          <div className="distribution-panel">
            <h3 className="distribution-panel-title">Distribución Cenas</h3>
            <div className="distribution-panel-content">
              <div className="distribution-section">
                <h4 className="distribution-section-title">Reservas Pendientes</h4>
                {renderReservationList(reservations.evening)}
              </div>
              
              <div className="distribution-section">
                <h4 className="distribution-section-title">Distribución de Mesas</h4>
                {renderTableGrid(tables)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
