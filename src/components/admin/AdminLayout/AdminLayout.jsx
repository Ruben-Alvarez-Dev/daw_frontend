import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useConfiguration } from '../../../context/ConfigurationContext';
import AdminConfiguration from '../AdminConfiguration/AdminConfiguration';
import AdminAssignation from '../AdminAssignation/AdminAssignation';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminUsers from '../AdminUsers/AdminUsers';
import AdminTables from '../AdminTables/AdminTables';
import AdminReservations from '../AdminReservations/AdminReservations';
import Button from '../../common/Button/Button';
import './AdminLayout.css';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="admin-layout">
      <div className="admin-layout__tabs">
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
          variant={activeTab === 'assignation' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('assignation')}
          label="Asignación"
        />
        <Button
          variant={activeTab === 'configuration' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('configuration')}
          label="Perfil"
        />
      </div>

      <div className="admin-layout__content">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'tables' && <AdminTables />}
        {activeTab === 'reservations' && <AdminReservations />}
        {activeTab === 'assignation' && <AdminAssignation />}
        {activeTab === 'configuration' && <AdminConfiguration />}
      </div>
    </div>
  );
}
