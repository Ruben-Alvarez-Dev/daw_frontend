import { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminAside from './AdminAside';
import AdminUserList from './AdminUserList';
import AdminReservationList from './AdminReservationList';
import AdminTables from './AdminTables';
import AdminTableList from './AdminTableList';
import AdminTableForm from './AdminTableForm';
import ShiftList from './shifts/ShiftList';
import ShiftDistribution from './shifts/ShiftDistribution';
import ShiftHistory from './shifts/ShiftHistory';
import RestaurantProfile from './RestaurantProfile';
import { ShiftProvider } from '../../context/ShiftContext';
import AdminUserForm from './AdminUserForm';
import AdminReservationForm from './AdminReservationForm';
import AdminAssignment from './AdminAssignment';
import Mapa from './Mapa';
import DailyView from './DailyView';
import AdminMaps from './AdminMaps';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('users');
  const [editingReservation, setEditingReservation] = useState(null);
  const [editingTable, setEditingTable] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const reservationListRef = useRef();
  const userListRef = useRef();
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

  const handleUserCreated = () => {
    if (userListRef.current) {
      userListRef.current.refresh();
    }
    setEditingUser(null);
  };

  const handleUserEdit = (user) => {
    setEditingUser(user);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
            <AdminUserForm 
              onUserCreated={handleUserCreated}
              editingUser={editingUser}
            />
            <AdminUserList 
              ref={userListRef}
              onEdit={handleUserEdit}
            />
          </>
        );
      case 'reservations':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
            <AdminReservationForm 
              onReservationCreated={handleReservationCreated}
              editingReservation={editingReservation}
            />
            <AdminReservationList 
              ref={reservationListRef}
              onEdit={handleReservationEdit}
            />
          </>
        );
      case 'tables':
        return (
          <Routes>
            <Route path="/" element={<AdminTables />}>
              <Route index element={<AdminTableList />} />
              <Route path="new" element={<AdminTableForm />} />
              <Route path=":id/edit" element={<AdminTableForm />} />
            </Route>
          </Routes>
        );
      case 'shifts':
        return (
          <ShiftProvider>
            <Routes>
              <Route path="/" element={<ShiftList />} />
              <Route path=":shiftId/distribution" element={<ShiftDistribution />} />
              <Route path=":shiftId/history" element={<ShiftHistory />} />
            </Routes>
          </ShiftProvider>
        );
      case 'config':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Configuración del Restaurante</h2>
            <RestaurantProfile />
          </>
        );
      case 'assignment':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Asignación de Turnos</h2>
            <AdminAssignment />
          </>
        );
      case 'mapa':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Mapa</h2>
            <Mapa />
          </>
        );
      case 'maps':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Editor del Mapa</h2>
            <AdminMaps />
          </>
        );
      case 'diario':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Vista Diaria</h2>
            <DailyView />
          </>
        );
      default:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
            <AdminUserForm 
              onUserCreated={handleUserCreated}
              editingUser={editingUser}
            />
            <AdminUserList 
              ref={userListRef}
              onEdit={handleUserEdit}
            />
          </>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminAside 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="admin-dashboard__content">
        {renderContent()}
      </div>
    </div>
  );
}
