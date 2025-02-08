import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card/Card';
import CustomerReservationForm from './CustomerReservationForm';
import CustomerReservationList from './CustomerReservationList';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
    const [refreshList, setRefreshList] = useState(0);
    const [reservations, setReservations] = useState([]);
    const { token } = useAuth();

    const handleReservationCreated = () => {
        setRefreshList(prev => prev + 1);
    };

    return (
        <div className="customer-dashboard">
            <Card
                header={<h3>Nueva Reserva</h3>}
                body={
                    <CustomerReservationForm 
                        onReservationCreated={handleReservationCreated}
                        token={token}
                    />
                }
            />

            <Card
                header={<h3>Mis Reservas</h3>}
                body={
                    <CustomerReservationList 
                        refreshTrigger={refreshList}
                        token={token}
                        onReservationsLoaded={setReservations}
                    />
                }
            />
        </div>
    );
}
