import { useState, useEffect } from 'react';
import Button from '../../common/Button/Button';
import './AdminTableList.css';

export default function AdminTableList({ onEdit }) {
  // Temporary mock data - replace with actual API call
  const [tables] = useState([
    { id: 1, number: 1, capacity: 4, status: 'available' },
    { id: 2, number: 2, capacity: 2, status: 'occupied' },
    { id: 3, number: 3, capacity: 6, status: 'reserved' },
  ]);

  const getStatusLabel = (status) => {
    const statusMap = {
      available: 'Disponible',
      occupied: 'Ocupada',
      reserved: 'Reservada',
      maintenance: 'Mantenimiento'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="admin-table-list">
      <div className="table-header">
        <div>Número</div>
        <div>Capacidad</div>
        <div>Estado</div>
        <div>Acciones</div>
      </div>
      {tables.map(table => (
        <div key={table.id} className="table-row">
          <div>{table.number}</div>
          <div>{table.capacity} personas</div>
          <div>
            <span className={getStatusClass(table.status)}>
              {getStatusLabel(table.status)}
            </span>
          </div>
          <div className="table-actions">
            <Button
              variant="secondary"
              size="small"
              label="Editar"
              onClick={() => onEdit(table)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
