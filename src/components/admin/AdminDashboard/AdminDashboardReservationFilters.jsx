import React from 'react';
import Button from '../../common/Button/Button';
import './AdminDashboardReservationFilters.css';

const RESERVATION_STATUSES = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'seated', label: 'Seated' },
    { key: 'no-show', label: 'No-Show' },
    { key: 'cancelled', label: 'Cancelled' }
];

export default function AdminDashboardReservationFilters({ selectedStatus = 'all', onStatusChange }) {
    return (
        <div className="admin-dashboard-reservation-filters">
            {RESERVATION_STATUSES.map(status => (
                <Button
                    key={status.key}
                    variant={selectedStatus === status.key ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => onStatusChange?.(status.key)}
                >
                    {status.label}
                </Button>
            ))}
        </div>
    );
}
