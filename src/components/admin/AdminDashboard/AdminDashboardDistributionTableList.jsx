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
        if (!reservationId) return null;
        
        // Buscar la reserva en el array de reservas
        return Object.values(shiftData?.reservations || {}).find(
            res => res.id === parseInt(reservationId)
        );
    };

    // Función auxiliar para comprobar si una mesa está seleccionada temporalmente
    const isTableSelected = (tableId) => {
        return selectedTables.includes(tableId);
    };

    // Función auxiliar para comprobar si una mesa está asignada a la reserva actual
    const isTableAssigned = (tableId) => {
        if (!selectedReservation) return false;
        const assignedId = shiftData?.distribution?.[`table_${tableId}`];
        return assignedId ? parseInt(assignedId) === parseInt(selectedReservation) : false;
    };

    // Función auxiliar para formatear la hora según el turno
    const getShiftTime = (shift) => {
        return shift === 'lunch' ? '14:00' : '21:00';
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
                            {isAssigned ? (
                                <>
                                    <div className="table-header">{table.name} ({assignedReservation.guests} pax)</div>
                                    <div className="table-separator"></div>
                                    <div className="table-assignment">
                                        <div className="table-time">{getShiftTime(assignedReservation.shift)}</div>
                                        <div className="table-user">{assignedReservation.user?.name || `Usuario #${assignedReservation.user?.id}`}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="table-name">{table.name}</div>
                                    <div className="table-capacity">{table.capacity} pax</div>
                                </>
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
