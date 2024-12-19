import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
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

  const renderReservationItem = (reservation) => (
    <>
      <div className="reservation-primary">
        <span className="reservation-id">#{reservation.id}</span>
      </div>
      <div className="reservation-secondary">
        <span className="reservation-table">Mesa: {reservation.table?.number}</span>
        <span className="reservation-date">{new Date(reservation.date).toLocaleString()}</span>
      </div>
      <div className="reservation-tertiary">
        <span className="reservation-people">Personas: {reservation.people}</span>
      </div>
    </>
  )

  const renderReservationList = () => {
    if (loading) return <p className="loading-message">Cargando reservas...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!reservations || reservations.length === 0) return <p className="empty-message">No hay reservas registradas</p>

    return (
      <List
        items={reservations}
        renderItem={renderReservationItem}
        threeLines={true}
        activeItem={activeItems.reservation}
        onItemClick={handleItemClick}
      />
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
