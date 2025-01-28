import { useState, useRef } from 'react';
import AdminReservationForm from '../AdminReservationForm';
import AdminReservationList from '../AdminReservationList';
import AdminTableForm from '../AdminTableForm';
import AdminTableList from '../AdminTableList';
import RestaurantProfile from '../RestaurantProfile';
import AdminAssignment from '../AdminAssignment';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminUsers from '../AdminUsers/AdminUsers';
import Button from '../../layout/Button/Button';
import './AdminDisplay.css';

export default function AdminDisplay() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingReservation, setEditingReservation] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const reservationListRef = useRef();
  const tableListRef = useRef();

  const handleReservationCreated = () => {
    if (reservationListRef.current) {
      reservationListRef.current.refresh();
    }
    setEditingReservation(null);
  };

  const handleReservationEdit = (reservation) => {
    setEditingReservation(reservation);
  };

  const handleTableCreated = () => {
    if (tableListRef.current) {
      tableListRef.current.refresh();
    }
    setEditingTable(null);
  };

  const handleTableEdit = (table) => {
    setEditingTable(table);
  };

  return (
    <div className="admin-display">
      <div className="admin-display__tabs">
        <Button
          variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('dashboard')}
          label="Dashboard"
        />
        <Button
          variant={activeTab === 'users' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('users')}
          label="Usuarios"
        />
        <Button
          variant={activeTab === 'tables' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('tables')}
          label="Mesas"
        />
        <Button
          variant={activeTab === 'reservations' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('reservations')}
          label="Reservas"
        />
        <Button
          variant={activeTab === 'profile' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('profile')}
          label="Configuración"
        />
        <Button
          variant={activeTab === 'assignment' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('assignment')}
          label="Asignación"
        />
      </div>

      <div className="admin-display__content">
        {activeTab === 'dashboard' && (
          <AdminDashboard onActionClick={setActiveTab} />
        )}

        {activeTab === 'users' && (
          <AdminUsers />
        )}

        {activeTab === 'tables' && (
          <>
            <h2 className="admin-display__section-title">Gestión de Mesas</h2>
            <AdminTableForm
              onTableCreated={handleTableCreated}
              editingTable={editingTable}
            />
            <AdminTableList
              ref={tableListRef}
              onEdit={handleTableEdit}
            />
          </>
        )}

        {activeTab === 'reservations' && (
          <>
            <h2 className="admin-display__section-title">Gestión de Reservas</h2>
            <AdminReservationForm
              onReservationCreated={handleReservationCreated}
              editingReservation={editingReservation}
            />
            <AdminReservationList
              ref={reservationListRef}
              onEdit={handleReservationEdit}
            />
          </>
        )}

        {activeTab === 'profile' && (
          <RestaurantProfile />
        )}

        {activeTab === 'assignment' && (
          <AdminAssignment />
        )}
      </div>
    </div>
  );
}
