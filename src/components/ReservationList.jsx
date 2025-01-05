import './List.css'

function ReservationList({ reservations, selectedReservation, onSelectReservation, onCreateNew }) {
  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Reservations</h2>
        <button onClick={onCreateNew} className="btn-add">
          Add New Reservation
        </button>
      </div>
      <div className="list-content">
        {reservations.map(reservation => (
          <div
            key={reservation.id}
            className={`list-item ${selectedReservation?.id === reservation.id ? 'selected' : ''}`}
            onClick={() => onSelectReservation(reservation)}
          >
            <div className="item-info">
              <span className="item-name">
                {reservation.table.name} - {reservation.user.name}
              </span>
              <span className="item-detail">
                {new Date(reservation.datetime).toLocaleString()} | 
                {reservation.guests} guests | {reservation.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReservationList
