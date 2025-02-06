import React, { useEffect } from 'react';
import Card from '../../common/Card/Card';
import ShiftSelector from './AdminDashboardDistributionShiftSelector';
import AdminDashboardDistributionGrid from './AdminDashboardDistributionGrid';
import { useShifts } from '../../../context/ShiftsContext';
import './AdminDashboardDistribution.css';

export default function AdminDashboardDistribution({ 
    selectedDate,
    selectedShift,
    onDateChange,
    onShiftChange,
    shiftStats
}) {
    const { fetchShiftConfiguration, isLoading, error } = useShifts();

    // Solo se ejecuta cuando cambia la fecha o el turno
    useEffect(() => {
        if (selectedDate && selectedShift) {
            fetchShiftConfiguration(selectedDate, selectedShift);
        }
    }, [selectedDate, selectedShift]); // Quitamos fetchShiftConfiguration de las dependencias

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
                    {error && <div className="error-message">{error}</div>}
                    {isLoading ? (
                        <div className="loading-message">Cargando...</div>
                    ) : (
                        <AdminDashboardDistributionGrid />
                    )}
                </div>
            }
        />
    );
}
