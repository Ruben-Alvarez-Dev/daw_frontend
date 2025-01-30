import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useConfiguration } from '../../../context/ConfigurationContext';
import RestaurantProfile from '../RestaurantProfile';
import AdminAssignment from '../AdminAssignment';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminUsers from '../AdminUsers/AdminUsers';
import AdminTables from '../AdminTables/AdminTables';
import AdminReservations from '../AdminReservations/AdminReservations';
import Button from '../../common/Button/Button';
import './AdminDisplay.css';

export default function AdminDisplay() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
          variant={activeTab === 'assignment' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('assignment')}
          label="Asignación"
        />
        <Button
          variant={activeTab === 'profile' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('profile')}
          label="Perfil"
        />
      </div>

      <div className="admin-display__content">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'tables' && <AdminTables />}
        {activeTab === 'reservations' && <AdminReservations />}
        {activeTab === 'assignment' && <AdminAssignment />}
        {activeTab === 'profile' && <RestaurantProfile />}
      </div>
    </div>
  );
}
