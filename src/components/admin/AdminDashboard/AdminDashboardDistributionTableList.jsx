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
        handleReservationSelect,
        hoveredReservation,
        setHoveredReservation
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
        return Object.values(shiftData?.reservations || {}).find(
            res => res.id === parseInt(reservationId)
        );
    };

    const handleTableHover = (tableId) => {
        const reservationId = shiftData?.distribution?.[`table_${tableId}`];
        if (reservationId) {
            setHoveredReservation(parseInt(reservationId));
        }
    };

    const handleTableLeave = () => {
        setHoveredReservation(null);
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

    const handleTableClick = (tableId) => {
        if (selectedReservation) {
            toggleTableSelection(tableId, selectedDate, selectedShift);
        }
    };

    const handleAssignTables = async () => {
        await assignSelectedTables(selectedDate, selectedShift);
    };

    return (
        <div className="table-grid-container">
            <div className="table-grid">
                {tables.map((table) => {
                    const assignedReservation = findReservationForTable(table.id);
                    const isAssigned = !!assignedReservation;
                    const isAssignedToSelected = isTableAssigned(table.id);
                    const isAssignedToOther = isAssigned && !isAssignedToSelected;
                    const isSelected = isTableSelected(table.id);
                    const isSelectable = selectedReservation !== null && !isAssignedToOther;
                    const isHighlighted = hoveredReservation && assignedReservation?.id === hoveredReservation;

                    return (
                        <div
                            key={table.id}
                            className={`table-item${isSelectable ? ' selectable' : ''}${isSelected ? ' selected' : ''}${isHighlighted ? ' table-item--highlighted' : ''}${isAssignedToSelected ? ' assigned-to-selected' : ''}${isAssignedToOther ? ' assigned-to-other' : ''}`}
                            onClick={() => isSelectable && handleTableClick(table.id)}
                            onMouseEnter={() => handleTableHover(table.id)}
                            onMouseLeave={handleTableLeave}
                        >
                            {isAssigned ? (
                                <>
                                    <div className="table-header">{table.name} ({assignedReservation.guests})</div>
                                    <div className="table-separator"></div>
                                    <div className="table-assignment">
                                        <div className="table-time">{assignedReservation.time}</div>
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
