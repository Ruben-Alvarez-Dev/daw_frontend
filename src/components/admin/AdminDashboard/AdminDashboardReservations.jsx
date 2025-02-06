import React, { useState } from 'react';
import Card from '../../common/Card/Card';
import AdminDashboardReservationList from './AdminDashboardReservationList.jsx';
import AdminDashboardReservationFilters from './AdminDashboardReservationFilters.jsx';

export default function AdminDashboardReservations({ selectedDate, selectedShift }) {
    const [selectedStatus, setSelectedStatus] = useState('all');

    return (
        <Card
            header={
                <AdminDashboardReservationFilters 
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                />
            }
            body={
                <AdminDashboardReservationList 
                    status={selectedStatus}
                    selectedDate={selectedDate}
                    selectedShift={selectedShift}
                />
            }
        />
    );
}
