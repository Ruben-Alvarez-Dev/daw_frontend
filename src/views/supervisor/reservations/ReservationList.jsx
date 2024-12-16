import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const ReservationList = () => {
  return (
    <Card
      card-header={<h3>Lista de Reservas</h3>}
      card-body={
        <>
          <div className="reservation-list">
            <ul>
              <li>Reserva #1 - Mesa 4 - 20:00 - Ana Martínez</li>
              <li>Reserva #2 - Mesa 7 - 21:30 - Pedro Sánchez</li>
              <li>Reserva #3 - Mesa 2 - 19:00 - Luis Rodríguez</li>
            </ul>
          </div>
        </>
      }
      card-footer={
        <>
          <Button title="Actualizar" variant="secondary" />
          <Button title="Gestionar Reserva" variant="primary" />
        </>
      }
    />
  )
}

export default ReservationList
