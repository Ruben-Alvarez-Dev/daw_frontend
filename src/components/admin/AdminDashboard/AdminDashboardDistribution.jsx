import React, { useEffect } from 'react';
import Card from '../../common/Card/Card';
import ShiftSelector from './AdminDashboardShiftSelector';
import AdminDashboardDistributionTableList from './AdminDashboardDistributionTableList';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardDistribution.css';

export default function AdminDashboardDistribution({ 
    selectedDate,
    selectedShift,
    onDateChange,
    onShiftChange,
    shiftStats
}) {
    const { loadReservations } = useDashboard();

    useEffect(() => {
        if (selectedDate && selectedShift) {
            loadReservations(selectedDate, selectedShift);
        }
    }, [selectedDate, selectedShift, loadReservations]);

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
            body={<AdminDashboardDistributionTableList />}
        />
    );
}
