import { useState } from 'react';
import CustomerProfile from './CustomerProfile';
import CustomerReservationList from './CustomerReservationList';
import CustomerReservationForm from './CustomerReservationForm';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showNewReservationForm, setShowNewReservationForm] = useState(false);

  const renderContent = () => {
    if (showNewReservationForm) {
      return (
        <CustomerReservationForm
          onReservationCreated={() => {
            setShowNewReservationForm(false);
            // Si estamos en la pestaña de reservas, forzar refresh
            if (activeTab === 'reservations') {
              setActiveTab('refresh-reservations');
              setTimeout(() => setActiveTab('reservations'), 0);
            }
          }}
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return <CustomerProfile />;
      case 'reservations':
      case 'refresh-reservations':
        return (
          <CustomerReservationList
            onNewReservation={() => setShowNewReservationForm(true)}
          />
        );
      default:
        return <CustomerProfile />;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => {
            setActiveTab('profile');
            setShowNewReservationForm(false);
          }}
          className={`px-4 py-2 ${
            activeTab === 'profile' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => {
            setActiveTab('reservations');
            setShowNewReservationForm(false);
          }}
          className={`px-4 py-2 ${
            activeTab === 'reservations' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          Reservas
        </button>
      </div>

      {renderContent()}
    </div>
  );
}
