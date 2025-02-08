import { useState } from 'react';
import CustomerDashboard from '../Dashboard/CustomerDashboard';
import CustomerProfile from '../Profile/CustomerProfile';
import Button from '../../common/Button/Button';
import './CustomerLayout.css';

export default function CustomerLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="customer-layout">
            <div className="customer-layout__nav">
                <Button
                    variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('dashboard')}
                    label="Mis Reservas"
                />
                <Button
                    variant={activeTab === 'profile' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('profile')}
                    label="Mi Perfil"
                />
            </div>

            <div className="customer-layout__content">
                {activeTab === 'dashboard' && <CustomerDashboard />}
                {activeTab === 'profile' && <CustomerProfile />}
            </div>
        </div>
    );
}
