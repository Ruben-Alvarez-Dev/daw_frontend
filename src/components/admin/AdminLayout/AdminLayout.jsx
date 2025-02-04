import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useConfiguration } from '../../../context/ConfigurationContext';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminUsers from '../AdminUsers/AdminUsers';
import AdminTables from '../AdminTables/AdminTables';
import AdminReservations from '../AdminReservations/AdminReservations';
import AdminConfiguration from '../AdminConfiguration/AdminConfiguration';
import Button from '../../common/Button/Button';
import './AdminLayout.css';

export default function AdminLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-layout">
            <div className="admin-layout__nav">
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
                    variant={activeTab === 'configuration' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('configuration')}
                    label="Configuración"
                />
            </div>
            <div className="admin-layout__content">
                {activeTab === 'dashboard' && <AdminDashboard />}
                {activeTab === 'users' && <AdminUsers />}
                {activeTab === 'tables' && <AdminTables />}
                {activeTab === 'reservations' && <AdminReservations />}
                {activeTab === 'configuration' && <AdminConfiguration />}
            </div>
        </div>
    );
}
