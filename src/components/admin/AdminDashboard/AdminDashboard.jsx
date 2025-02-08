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
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/shifts/${selectedDate}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al cargar los datos del turno');
                }

                const data = await response.json();
                setShiftStats({
                    lunch: data.lunch,
                    dinner: data.dinner
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setShiftStats({
                    lunch: { total_pax: 0, tables: {}, reservations: {}, distribution: {} },
                    dinner: { total_pax: 0, tables: {}, reservations: {}, distribution: {} }
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
