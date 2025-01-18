import { useState, useRef } from 'react';
import AdminReservationForm from './AdminReservationForm';
import AdminReservationList from './AdminReservationList';
import AdminUserForm from './AdminUserForm';
import AdminUserList from './AdminUserList';
import AdminTableForm from './AdminTableForm';
import AdminTableList from './AdminTableList';
import RestaurantProfile from './RestaurantProfile';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      {/* Pestañas de navegación */}
      <div className="flex mb-8 space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'users' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'tables' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('tables')}
        >
          Mesas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'reservations' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('reservations')}
        >
          Reservas
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'profile' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Configuración
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'assignment' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('assignment')}
        >
          Asignación
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'users' && (
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
        )}

        {activeTab === 'tables' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Mesas</h2>
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
        )}

        {activeTab === 'profile' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Configuración del Restaurante</h2>
            <RestaurantProfile />
          </>
        )}

        {activeTab === 'assignment' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Asignación de Turnos</h2>
            <div className="text-gray-500 italic">Componente en desarrollo</div>
          </>
        )}
      </div>
    </div>
  );
}
