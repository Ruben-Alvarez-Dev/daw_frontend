import React, { useState } from 'react';
import Card from '../../common/Card/Card';
import AdminDashboardReservationList from './AdminDashboardReservationList.jsx';
import AdminDashboardReservationFilters from './AdminDashboardReservationFilters.jsx';

export default function AdminDashboardReservations() {
    const [selectedStatus, setSelectedStatus] = useState('all');

    return (
        <Card
            header={
                <AdminDashboardReservationFilters 
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                />
            }
            body={<AdminDashboardReservationList status={selectedStatus} />}
        />
    );
}
