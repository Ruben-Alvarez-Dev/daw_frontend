import React, { useEffect } from 'react';
import Card from '../../common/Card/Card';
import ShiftSelector from './AdminDashboardShiftSelector';
import AdminDashboardReservationList from './AdminDashboardReservationList';
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
    const { loadReservations, loadTablesAndDistribution } = useDashboard();

    useEffect(() => {
        if (selectedDate && selectedShift) {
            loadReservations(selectedDate, selectedShift);
            loadTablesAndDistribution(selectedDate, selectedShift);
        }
    }, [selectedDate, selectedShift]);

    return (
        <>
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
        </>

    );
}
