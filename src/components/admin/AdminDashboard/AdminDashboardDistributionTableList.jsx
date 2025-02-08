import React from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import './AdminDashboardDistributionTableList.css';

export default function AdminDashboardDistributionTableList() {
    const { 
        tables, 
        shiftData,
        selectedReservation,
        selectedDate,
        selectedShift,
        toggleTableSelection 
    } = useDashboard();

    // Si no hay mesas todavía, mostramos un estado de carga
    if (!tables) {
        return (
            <div className="table-grid-container">
                <div className="loading-message">
                    Cargando mesas...
                </div>
            </div>
        );
    }

    // Si no hay datos del turno todavía, mostramos un estado de carga
    if (!shiftData) {
        return (
            <div className="table-grid-container">
                <div className="loading-message">
                    Cargando datos del turno...
                </div>
            </div>
        );
    }

    // Función auxiliar para encontrar la reserva que tiene asignada una mesa
    const findReservationForTable = (tableId) => {
        const reservationId = shiftData?.distribution?.[`table_${tableId}`];
        return reservationId ? shiftData?.reservations?.[reservationId] : null;
    };

    // Función auxiliar para comprobar si una mesa está seleccionada
    const isTableSelected = (tableId) => {
        if (!selectedReservation) return false;
        return shiftData?.distribution?.[`table_${tableId}`] === parseInt(selectedReservation);
    };

    const handleTableClick = (tableId) => {
        toggleTableSelection(tableId, selectedDate, selectedShift);
    };

    return (
        <div className="table-grid-container">
            <div className="table-grid">
                {tables.map(table => {
                    const tableId = table.id;
                    const assignedReservation = findReservationForTable(tableId);
                    const isAssigned = !!assignedReservation;
                    const isAssignedToSelected = assignedReservation?.id === parseInt(selectedReservation);
                    const isAssignedToOther = isAssigned && !isAssignedToSelected;
                    const isSelected = isTableSelected(tableId);
                    const isSelectable = selectedReservation !== null && !isAssignedToOther;

                    return (
                        <div
                            key={table.id}
                            onClick={() => isSelectable && handleTableClick(tableId)}
                            className={`table-item ${isSelectable ? 'selectable' : ''} 
                                      ${isSelected ? 'selected' : ''} 
                                      ${isAssignedToSelected ? 'assigned-to-selected' : ''} 
                                      ${isAssignedToOther ? 'assigned-to-other' : ''}`}
                        >
                            <div className="table-name">Mesa {table.name}</div>
                            <div className="table-capacity">{table.capacity} pax</div>
                            {isAssigned && (
                                <div className="table-assignment">
                                    {assignedReservation.user?.name || `Usuario #${assignedReservation.user?.id}`}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedReservation && (
                <div className="table-instructions">
                    {Object.entries(shiftData.distribution).some(([_, resId]) => resId === parseInt(selectedReservation))
                        ? 'Haz clic de nuevo en la reserva para guardar los cambios'
                        : 'Haz clic en las mesas para asignarlas a la reserva'}
                </div>
            )}
        </div>
    );
}
