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

                if (!response.ok) {
                    throw new Error('Error al cargar estadísticas de turnos');
                }

                const data = await response.json();
                const stats = {
                    lunch: data.find(shift => shift.type === 'lunch') || { pending_reservations: 0, confirmed_reservations: 0, total_guests: 0 },
                    dinner: data.find(shift => shift.type === 'dinner') || { pending_reservations: 0, confirmed_reservations: 0, total_guests: 0 }
                };

                setShiftStats({
                    lunch: {
                        pending: stats.lunch.pending_reservations,
                        confirmed: stats.lunch.confirmed_reservations,
                        total_guests: stats.lunch.total_guests
                    },
                    dinner: {
                        pending: stats.dinner.pending_reservations,
                        confirmed: stats.dinner.confirmed_reservations,
                        total_guests: stats.dinner.total_guests
                    }
                });
            } catch (error) {
                console.error('Error fetching shift stats:', error);
            }
        };

        fetchShiftStats();
    }, [selectedDate, token]);

    return (
        <div className="admin-dashboard">
            <AdminDashboardReservations 
                selectedDate={selectedDate}
                selectedShift={selectedShift}
            />
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
