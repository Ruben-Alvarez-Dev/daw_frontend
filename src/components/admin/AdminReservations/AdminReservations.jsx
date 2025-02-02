import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminReservationForm from './AdminReservationForm';
import AdminReservationList from './AdminReservationList';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import './AdminReservations.css';

export default function AdminReservations() {
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshList, setRefreshList] = useState(0);
    const [reservations, setReservations] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0);
    const { token } = useAuth();

    const handleSave = () => {
        setSelectedReservation(null);
        setIsEditing(false);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (reservation) => {
        setSelectedReservation(reservation);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSelectedReservation(null);
        setIsEditing(false);
    };

    const handleReset = () => {
        setSelectedReservation(null);
        setIsEditing(false);
        setRefreshList(prev => prev + 1);
    };

    const handleSelect = (reservation) => {
        if (reservation.id === selectedReservation?.id) {
            setSelectedReservation(null);
        } else {
            setSelectedReservation(reservation);
            setIsEditing(false);
        }
    };

    const handleDelete = async (reservation) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la reserva #${reservation.id}?`)) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/${reservation.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la reserva');
            }

            setRefreshList(prev => prev + 1);
        } catch (err) {
            console.error('Error deleting reservation:', err);
            alert('Error al eliminar la reserva: ' + err.message);
        }
    };

    const handleFilteredCountChange = (count) => {
        setFilteredCount(count);
    };

    return (
        <div className="admin-reservations">
            <Card
                header="Nueva Reserva"
                body={
                    <AdminReservationForm
                        reservation={selectedReservation}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onReset={handleReset}
                        isEditing={isEditing}
                        readOnly={selectedReservation && !isEditing}
                    />
                }
                footer={
                    <Button onClick={handleReset} variant="secondary">
                        Limpiar
                    </Button>
                }
            />
            <Card
                header="Lista de Reservas"
                body={
                    <AdminReservationList
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        refresh={refreshList}
                        reservations={reservations}
                        setReservations={setReservations}
                        selectedReservation={selectedReservation}
                        onSelect={handleSelect}
                        onFilteredCountChange={handleFilteredCountChange}
                    />
                }
                footer={`Total: ${filteredCount} ${filteredCount === 1 ? 'reserva' : 'reservas'}`}
            />
        </div>
    );
}
