import CustomerProfile from './CustomerProfile';
import CustomerReservationList from './CustomerReservationList';
import './CustomerDisplay.css';

export default function CustomerDisplay({ activeSection, onNewReservation }) {
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <CustomerProfile />;
      case 'reservations':
        return <CustomerReservationList onNewReservation={onNewReservation} />;
      default:
        return <CustomerProfile />;
    }
  };

  return (
    <div className="customer-display">
      {renderContent()}
    </div>
  );
}
