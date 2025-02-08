import React from 'react';
import { useReservations } from '../../../context/ReservationsContext';
import './CustomerStats.css';

const CustomerStats = () => {
    const { reservations } = useReservations();

    const calculateStats = () => {
        console.log('Calculando estadísticas con reservas:', reservations);
        
        if (!reservations || !reservations.length) {
            return {
                totalReservations: 0,
                averageGuests: 0,
                favoriteShift: 'N/A',
                favoriteDay: 'N/A',
                status: 'Nuevo Cliente',
                shiftDistribution: { lunch: 0, dinner: 0 }
            };
        }

        // Total reservations (excluding cancelled)
        const validReservations = reservations.filter(r => r.status !== 'cancelled');
        const totalReservations = validReservations.length;

        // Average guests
        const averageGuests = Math.round(
            validReservations.reduce((acc, res) => acc + res.guests, 0) / totalReservations
        );

        // Favorite shift
        const shifts = validReservations.reduce((acc, res) => {
            acc[res.shift] = (acc[res.shift] || 0) + 1;
            return acc;
        }, {});
        
        const favoriteShift = Object.entries(shifts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

        // Favorite day
        const days = validReservations.reduce((acc, res) => {
            const day = new Date(res.date).getDay();
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        
        const favoriteDay = Object.entries(days).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Customer status
        let status = 'Nuevo Cliente';
        if (totalReservations > 10) status = 'Cliente VIP';
        else if (totalReservations > 5) status = 'Cliente Frecuente';
        else if (totalReservations > 2) status = 'Cliente Regular';

        // Shift distribution percentages
        const totalShifts = Object.values(shifts).reduce((a, b) => a + b, 0);
        const shiftDistribution = {
            lunch: ((shifts.lunch || 0) / totalShifts * 100) || 0,
            dinner: ((shifts.dinner || 0) / totalShifts * 100) || 0
        };

        console.log('Estadísticas calculadas:', {
            totalReservations,
            averageGuests,
            favoriteShift,
            favoriteDay: dayNames[favoriteDay],
            status,
            shiftDistribution
        });

        return {
            totalReservations,
            averageGuests,
            favoriteShift: favoriteShift === 'lunch' ? 'Comida' : 'Cena',
            favoriteDay: dayNames[favoriteDay],
            status,
            shiftDistribution
        };
    };

    const stats = calculateStats();

    return (
        <div className="stats-container">
            <div className="stats-header">
                <div className="status-badge">{stats.status}</div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Reservas</h3>
                    <p className="stat-value">{stats.totalReservations}</p>
                </div>

                <div className="stat-card">
                    <h3>Media de Comensales</h3>
                    <p className="stat-value">{stats.averageGuests}</p>
                </div>

                <div className="stat-card">
                    <h3>Turno Favorito</h3>
                    <p className="stat-value">{stats.favoriteShift}</p>
                </div>

                <div className="stat-card">
                    <h3>Día Favorito</h3>
                    <p className="stat-value">{stats.favoriteDay}</p>
                </div>
            </div>

            <div className="chart-container">
                <div className="pie-chart">
                    {stats.shiftDistribution.lunch > 0 && (
                        <div 
                            className="pie-segment lunch" 
                            style={{
                                transform: `rotate(0deg) scale(${stats.shiftDistribution.lunch / 100})`
                            }}
                        />
                    )}
                    {stats.shiftDistribution.dinner > 0 && (
                        <div 
                            className="pie-segment dinner" 
                            style={{
                                transform: `rotate(${stats.shiftDistribution.lunch * 3.6}deg) scale(${stats.shiftDistribution.dinner / 100})`
                            }}
                        />
                    )}
                </div>
                <div className="chart-legend">
                    <div className="legend-item">
                        <span className="legend-color lunch"></span>
                        <span>Comida ({Math.round(stats.shiftDistribution.lunch)}%)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color dinner"></span>
                        <span>Cena ({Math.round(stats.shiftDistribution.dinner)}%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerStats;
