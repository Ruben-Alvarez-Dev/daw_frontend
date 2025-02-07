import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardDistributionTableList.css';

export default function AdminDashboardDistributionTableList() {
    const { 
        tables, 
        distribution,
        selectedReservation,
        selectedTables,
        toggleTableSelection 
    } = useDashboard();

    return (
        <div className="table-grid-container">
            <div className="table-grid">
                {tables.map(table => {
                    const tableId = table.id.toString();
                    const isAssigned = distribution[tableId] !== undefined;
                    const isAssignedToSelected = distribution[tableId] === selectedReservation;
                    const isAssignedToOther = isAssigned && !isAssignedToSelected;
                    const isSelected = selectedTables.includes(tableId);
                    const isSelectable = selectedReservation !== null && !isAssignedToOther;

                    return (
                        <div
                            key={table.id}
                            onClick={() => isSelectable && toggleTableSelection(tableId)}
                            className={`table-item ${isSelectable ? 'selectable' : ''} 
                                      ${isSelected ? 'selected' : ''} 
                                      ${isAssignedToOther ? 'occupied' : ''}`}
                        >
                            <div className="table-number">Mesa {table.number}</div>
                            <div className="table-capacity">{table.capacity} pax</div>
                            {isAssignedToOther && (
                                <div className="table-reservation">
                                    #{distribution[tableId]}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedReservation && (
                <div className="table-instructions">
                    {selectedTables.length > 0 
                        ? 'Haz clic de nuevo en la reserva para guardar los cambios'
                        : 'Haz clic en las mesas para asignarlas a la reserva'}
                </div>
            )}
        </div>
    );
}
