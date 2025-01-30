import { useState } from 'react';
import Button from '../../common/Button/Button';
import './AdminReservationList.css';

export default function AdminReservationList({ onEdit }) {
  // Temporary mock data - replace with actual API call
  const [reservations] = useState([
    {
      id: 1,
      date: '2024-01-29',
      time: '20:00',
      guests: 4,
      name: 'Juan Pérez',
      phone: '666555444',
      email: 'juan@example.com',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-01-29',
      time: '21:30',
      guests: 2,
      name: 'María García',
      phone: '666777888',
      email: 'maria@example.com',
      status: 'pending'
    }
  ]);

  const getStatusLabel = (status) => {
    const statusMap = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-reservation-list">
      <div className="reservation-header">
        <div>Fecha</div>
        <div>Hora</div>
        <div>Comensales</div>
        <div>Cliente</div>
        <div>Estado</div>
        <div>Acciones</div>
      </div>
      {reservations.map(reservation => (
        <div key={reservation.id} className="reservation-row">
          <div>{formatDate(reservation.date)}</div>
          <div>{reservation.time}</div>
          <div>{reservation.guests} personas</div>
          <div>
            <div className="customer-info">
              <span>{reservation.name}</span>
              <small>{reservation.phone}</small>
            </div>
          </div>
          <div>
            <span className={getStatusClass(reservation.status)}>
              {getStatusLabel(reservation.status)}
            </span>
          </div>
          <div className="reservation-actions">
            <Button
              variant="secondary"
              size="small"
              label="Editar"
              onClick={() => onEdit(reservation)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
