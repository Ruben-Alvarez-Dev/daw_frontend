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
              <li>Reserva #1 - Mesa 4 - 20:00 - 4 personas</li>
              <li>Reserva #2 - Mesa 7 - 21:30 - 2 personas</li>
              <li>Reserva #3 - Mesa 2 - 19:00 - 6 personas</li>
            </ul>
          </div>
        </>
      }
      card-footer={
        <>
          <Button title="Actualizar" variant="secondary" />
          <Button title="Añadir Reserva" variant="primary" />
        </>
      }
    />
  )
}

export default ReservationList
