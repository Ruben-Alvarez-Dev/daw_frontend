import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './ReservationList.css'

const ReservationList = ({ onEdit }) => {
  const { 
    data: { reservations },
    loading: { reservations: loading },
    errors: { reservations: error },
    activeItems,
    setActiveItem,
    loadReservations
  } = useApp()

  useEffect(() => {
    loadReservations()
  }, [])

  const handleEdit = (reservation) => {
    if (onEdit) onEdit(reservation)
  }

  const handleItemClick = (reservation) => {
    if (activeItems.reservation && activeItems.reservation.id_reservation === reservation.id_reservation) {
      setActiveItem('reservation', null)
    } else {
      setActiveItem('reservation', reservation)
    }
  }

  const renderReservationList = () => {
    if (loading) return <p className="loading-message">Cargando reservas...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!reservations || reservations.length === 0) return <p className="empty-message">No hay reservas registradas</p>

    return (
      <ul className="reservations-list">
        {reservations.map((reservation) => {
          // Asegurarnos de que tables sea un array
          const tables = Array.isArray(reservation.tables) ? reservation.tables : 
                        (typeof reservation.tables === 'string' ? JSON.parse(reservation.tables) : []);
          
          return (
            <li 
              key={reservation.id_reservation}
              className={`reservation-item ${activeItems.reservation?.id_reservation === reservation.id_reservation ? 'active' : ''}`}
              onClick={() => handleItemClick(reservation)}
            >
              <div className="reservation-primary">
                <span className="reservation-id">#{reservation.id_reservation}</span>
              </div>
              <div className="reservation-secondary">
                <span className="reservation-table">Mesa: {tables.join(', ')}</span>
                <span className="reservation-date">{new Date(reservation.datetime).toLocaleString()}</span>
              </div>
              <div className="reservation-tertiary">
                <span className="reservation-status">{reservation.status}</span>
              </div>
            </li>
          );
        })}
      </ul>
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Reservas</h3>}
      card-body={renderReservationList()}
      card-footer={
        <Button 
          title="Nuevo" 
          variant="primary" 
          onClick={() => handleEdit(null)}
        />
      }
    />
  )
}

export default ReservationList
