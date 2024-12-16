import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const ReservationList = () => {
  return (
    <Card
      card-header={<h3>Mis Reservas</h3>}
      card-body={
        <>
          <div className="reservation-list">
            <ul>
              <li>Reserva #1 - La Parrilla - Mesa 4 - 20:00</li>
              <li>Reserva #2 - El Pescador - Mesa 7 - 21:30</li>
              <li>Reserva #3 - Veggie Garden - Mesa 2 - 19:00</li>
            </ul>
          </div>
        </>
      }
      card-footer={
        <>
          <Button title="Actualizar" variant="secondary" />
          <Button title="Nueva Reserva" variant="primary" />
        </>
      }
    />
  )
}

export default ReservationList
