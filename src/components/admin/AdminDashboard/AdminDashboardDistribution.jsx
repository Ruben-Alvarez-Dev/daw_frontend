import React from 'react';
import Card from '../../common/Card/Card';
import ShiftSelector from './AdminDashboardShiftSelector.jsx';
import './AdminDashboardDistribution.css';

export default function AdminDashboardDistribution({ 
    selectedDate,
    selectedShift,
    onDateChange,
    onShiftChange,
    shiftStats
}) {
    return (
        <Card
            header={
                <ShiftSelector
                    selectedDate={selectedDate}
                    selectedShift={selectedShift}
                    onDateChange={onDateChange}
                    onShiftChange={onShiftChange}
                    shiftStats={shiftStats}
                />
            }
            body={
                <div className="admin-dashboard-distribution">
                    {/* Distribution content will be implemented later */}
                    <div className="distribution-placeholder">
                        Distribution view coming soon
                    </div>
                </div>
            }
        />
    );
}
