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
        toggleTableSelection,
        selectedTables,
        assignSelectedTables,
        handleReservationSelect
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

    // Función auxiliar para comprobar si una mesa está seleccionada temporalmente
    const isTableSelected = (tableId) => {
        return selectedTables.includes(tableId);
    };

    // Función auxiliar para comprobar si una mesa está asignada a la reserva actual
    const isTableAssigned = (tableId) => {
        if (!selectedReservation) return false;
        return shiftData?.distribution?.[`table_${tableId}`] === parseInt(selectedReservation);
    };

    const handleTableClick = (tableId) => {
        toggleTableSelection(tableId, selectedDate, selectedShift);
    };

    const handleAssignTables = async () => {
        await assignSelectedTables(selectedDate, selectedShift);
    };

    return (
        <div className="table-grid-container">
            <div className="table-grid">
                {tables.map(table => {
                    const tableId = table.id;
                    const assignedReservation = findReservationForTable(tableId);
                    const isAssigned = !!assignedReservation;
                    const isAssignedToSelected = isTableAssigned(tableId);
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
                            <div className="table-capacity">{table.capacity} pax</div>
                            <div className="table-name">mesa {table.name}</div>
                            {isAssigned && (
                                <div className="table-assignment">
                                    {assignedReservation.id}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedReservation && (
                <div className="table-instructions">
                    Selecciona las mesas que quieres asignar
                </div>
            )}
        </div>
    );
}
