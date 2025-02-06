import React from 'react';
import { useShifts } from '../../../context/ShiftsContext';
import './AdminDashboardDistributionGrid.css';

export default function AdminDashboardDistributionGrid() {
    const { currentShift } = useShifts();
    const tables = currentShift?.tables || [];
    const distribution = currentShift?.distribution || {};

    if (!tables.length) {
        return <div className="table-grid-message">No hay mesas configuradas</div>;
    }

    return (
        <ul className="admin-dashboard-distribution-grid">
            {tables.map((table) => {
                const reservationId = distribution[`table_${table.id}`];
                const status = reservationId ? 'occupied' : 'available';

                return (
                    <li key={table.id} className={`table-item ${status}`}>
                        <span className="table-name">Mesa {table.name}</span>
                        <span className="table-capacity">{table.capacity} personas</span>
                    </li>
                );
            })}
        </ul>
    );
}
