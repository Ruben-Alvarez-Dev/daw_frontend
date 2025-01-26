import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TableAvailability from './TableAvailability';
import CustomerReservationForm from './CustomerReservationForm';
import './ReservationProcess.css';

export default function ReservationProcess({ onReservationComplete }) {
  const [step, setStep] = useState('availability'); // 'availability' | 'confirmation'
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  const handleTableSelect = (tableData) => {
    setSelectedTable(tableData);
    setStep('confirmation');
  };

  const handleConfirmReservation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_id: selectedTable.table.id,
          datetime: `${selectedTable.date} ${selectedTable.time}`,
          guests: selectedTable.guests,
          user_id: user.id,
          status: 'pending'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la reserva');
      }

      if (onReservationComplete) {
        onReservationComplete();
      }
    } catch (err) {
      setError(err.message || 'Error al crear la reserva');
    }
  };

  return (
    <div className="reservation-process">
      {error && (
        <div className="reservation-process__error">
          {error}
        </div>
      )}

      {step === 'availability' ? (
        <div className="reservation-process__step">
          <h2 className="reservation-process__title">Selecciona una mesa</h2>
          <TableAvailability onTableSelect={handleTableSelect} />
        </div>
      ) : (
        <div className="reservation-process__step">
          <h2 className="reservation-process__title">Confirma tu reserva</h2>
          <div className="reservation-process__summary">
            <p><strong>Mesa:</strong> {selectedTable.table.number}</p>
            <p><strong>Fecha:</strong> {selectedTable.date}</p>
            <p><strong>Hora:</strong> {selectedTable.time}</p>
            <p><strong>Comensales:</strong> {selectedTable.guests}</p>
          </div>
          
          <div className="reservation-process__actions">
            <button 
              className="reservation-process__button reservation-process__button--secondary"
              onClick={() => setStep('availability')}
            >
              Volver
            </button>
            <button 
              className="reservation-process__button reservation-process__button--primary"
              onClick={handleConfirmReservation}
            >
              Confirmar Reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
