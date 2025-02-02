import { useState } from 'react';
import AdminReservationForm from './AdminReservationForm';
import AdminReservationList from './AdminReservationList';
import Card from '../../common/Card/Card';

export default function AdminReservations() {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [refreshList, setRefreshList] = useState(0);

    const handleSave = () => {
        setSelectedReservation(null);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
    };

    const handleCancel = () => {
        setSelectedReservation(null);
    };

    return (
        <>
            <Card title="Nueva Reserva">
                <AdminReservationForm
                    reservation={selectedReservation}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Card>
            <Card title="Reservas">
                <AdminReservationList 
                    onEdit={handleEdit}
                    key={refreshList}
                />
            </Card>
        </>
    );
}
