import { useState } from 'react';
import Card from '../../common/Card/Card';
import AdminReservationList from './AdminReservationList';
import AdminReservationForm from './AdminReservationForm';
import './AdminReservations.css';

export default function AdminReservations() {
  const [selectedReservation, setSelectedReservation] = useState(null);

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
  };

  const handleSave = () => {
    setSelectedReservation(null);
  };

  const handleCancel = () => {
    setSelectedReservation(null);
  };

  return (
    <>
      <div className="admin-reservations">
        <Card header={<h3>Nueva Reserva</h3>}>
          <AdminReservationForm
            reservation={selectedReservation}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>

        <Card header={<h3>Lista de Reservas</h3>}>
          <AdminReservationList
            onEdit={handleEdit}
          />
        </Card>
      </div>
    </>
  );
}
