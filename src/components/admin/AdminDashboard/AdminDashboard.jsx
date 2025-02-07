import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminDashboardReservations from './AdminDashboardReservations';
import AdminDashboardDistribution from './AdminDashboardDistribution';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedShift, setSelectedShift] = useState('lunch');
    const [shiftStats, setShiftStats] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchShiftStats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/shifts/${selectedDate}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.status === 404) {
                    // No hay shifts creados para este día
                    setShiftStats({
                        lunch: null,
                        dinner: null
                    });
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al cargar estadísticas de turnos');
                }

                const data = await response.json();
                const stats = {
                    lunch: data.find(shift => shift.type === 'lunch'),
                    dinner: data.find(shift => shift.type === 'dinner')
                };

                setShiftStats(stats);
            } catch (error) {
                console.error('Error fetching shift stats:', error);
                setShiftStats({
                    lunch: null,
                    dinner: null
                });
            }
        };

        fetchShiftStats();
    }, [selectedDate, token]);

    return (
        <div className="admin-dashboard">
            <AdminDashboardReservations />
            <AdminDashboardDistribution
                selectedDate={selectedDate}
                selectedShift={selectedShift}
                onDateChange={setSelectedDate}
                onShiftChange={setSelectedShift}
                shiftStats={shiftStats}
            />
        </div>
    );
}
