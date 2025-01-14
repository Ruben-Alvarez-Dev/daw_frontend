import { useState, useRef } from 'react';
import AdminReservationForm from './AdminReservationForm';
import AdminReservationList from './AdminReservationList';
import AdminUserForm from './AdminUserForm';
import AdminUserList from './AdminUserList';
import AdminTableForm from './AdminTableForm';
import AdminTableList from './AdminTableList';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const reservationListRef = useRef();
  const userListRef = useRef();
  const tableListRef = useRef();

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
      </div>

      {/* Contenido según la pestaña activa */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'users' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Usuarios</h2>
            <AdminUserForm listRef={userListRef} />
            <AdminUserList ref={userListRef} />
          </>
        )}

        {activeTab === 'tables' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Mesas</h2>
            <AdminTableForm listRef={tableListRef} />
            <AdminTableList ref={tableListRef} />
          </>
        )}

        {activeTab === 'reservations' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Gestión de Reservas</h2>
            <AdminReservationForm listRef={reservationListRef} />
            <AdminReservationList ref={reservationListRef} />
          </>
        )}
      </div>
    </div>
  );
}
