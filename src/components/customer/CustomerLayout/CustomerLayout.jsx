import { useState } from 'react';
import CustomerProfile from '../CustomerProfile';
import CustomerReservationForm from '../CustomerReservationForm';
import CustomerReservationList from '../CustomerReservationList';
import Button from '../../common/Button/Button';
import './CustomerLayout.css';

export default function CustomerLayout() {
    const [activeTab, setActiveTab] = useState('reservations');

    return (
        <div className="customer-layout">
            <div className="customer-layout__tabs">
                <Button
                    variant={activeTab === 'reservations' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('reservations')}
                    label="Mis Reservas"
                />
                <Button
                    variant={activeTab === 'profile' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('profile')}
                    label="Mi Perfil"
                />
            </div>

            <div className="customer-layout__content">
                {activeTab === 'reservations' && (
                    <div className="customer-display">
                        <div className="customer-content">
                            <CustomerReservationForm />
                            <CustomerReservationList />
                        </div>
                    </div>
                )}
                {activeTab === 'profile' && <CustomerProfile />}
            </div>
        </div>
    );
}
