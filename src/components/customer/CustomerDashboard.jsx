import { useState } from 'react';
import CustomerAside from './CustomerAside';
import CustomerDisplay from './CustomerDisplay';
import ReservationProcess from './ReservationProcess';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showNewReservation, setShowNewReservation] = useState(false);

  const handleNewReservation = () => {
    setShowNewReservation(true);
  };

  const handleReservationComplete = () => {
    setShowNewReservation(false);
    setActiveSection('reservations');
  };

  return (
    <div className="customer-dashboard">
      {showNewReservation ? (
        <ReservationProcess onReservationComplete={handleReservationComplete} />
      ) : (
        <>
          <CustomerAside 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <CustomerDisplay 
            activeSection={activeSection}
            onNewReservation={handleNewReservation}
          />
        </>
      )}
    </div>
  );
}
