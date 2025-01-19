import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TableAssignmentBoard.css';

export default function TableAssignmentBoard({ shift, tables, reservations }) {
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [assignments, setAssignments] = useState({});

  const handleTableClick = (tableId) => {
    if (selectedTable === tableId) {
      setSelectedTable(null);
    } else {
      setSelectedTable(tableId);
      if (selectedReservation) {
        // Si hay una reserva seleccionada, intentar asignar
        handleAssignment(tableId, selectedReservation);
      }
    }
  };

  const handleReservationClick = (reservationId) => {
    if (selectedReservation === reservationId) {
      setSelectedReservation(null);
    } else {
      setSelectedReservation(reservationId);
      if (selectedTable) {
        // Si hay una mesa seleccionada, intentar asignar
        handleAssignment(selectedTable, reservationId);
      }
    }
  };

  const handleAssignment = (tableId, reservationId) => {
    const table = tables.find(t => t.id === tableId);
    const reservation = reservations.find(r => r.id === reservationId);

    if (!isValidAssignment(table, reservation)) {
      alert('Esta mesa no es adecuada para el tamaño del grupo');
      return;
    }

    setAssignments(prev => ({
      ...prev,
      [tableId]: reservationId
    }));

    // Limpiar selecciones
    setSelectedTable(null);
    setSelectedReservation(null);
  };

  const isValidAssignment = (table, reservation) => {
    return table.capacity >= reservation.guests;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const tableId = result.destination.droppableId;
    const reservationId = result.draggableId;
    
    const table = tables.find(t => t.id === tableId);
    const reservation = reservations.find(r => r.id === reservationId);

    if (isValidAssignment(table, reservation)) {
      handleAssignment(tableId, reservationId);
    }
  };

  return (
    <div className="table-assignment-board">
      <h3>{shift === 'afternoon' ? 'Turno de Comidas' : 'Turno de Cenas'}</h3>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="tables-grid">
          {tables.map(table => (
            <Droppable key={table.id} droppableId={table.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`table-cell ${selectedTable === table.id ? 'selected' : ''} ${
                    snapshot.isDraggingOver ? 'dragging-over' : ''
                  }`}
                  onClick={() => handleTableClick(table.id)}
                >
                  <div className="table-info">
                    <span className="table-number">Mesa {table.number}</span>
                    <span className="table-capacity">{table.capacity} personas</span>
                  </div>
                  {assignments[table.id] && (
                    <div className="assigned-reservation">
                      {reservations.find(r => r.id === assignments[table.id])?.name}
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        <div className="reservations-list">
          <h4>Reservas pendientes</h4>
          {reservations.map((reservation, index) => (
            <Draggable
              key={reservation.id}
              draggableId={reservation.id}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`reservation-item ${
                    selectedReservation === reservation.id ? 'selected' : ''
                  } ${snapshot.isDragging ? 'dragging' : ''}`}
                  onClick={() => handleReservationClick(reservation.id)}
                >
                  <span className="reservation-name">{reservation.name}</span>
                  <span className="reservation-guests">{reservation.guests} personas</span>
                  <span className="reservation-time">{reservation.time}</span>
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
