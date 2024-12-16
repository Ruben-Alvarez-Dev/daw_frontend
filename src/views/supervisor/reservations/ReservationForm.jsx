import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const ReservationForm = () => {
  return (
    <Card
      card-header={<h3>Gestión de Reserva</h3>}
      card-body={
        <>
          <form className="reservation-form">
            <div className="form-group">
              <label>Reserva</label>
              <select>
                <option value="1">Reserva #1 - Mesa 4 - Ana Martínez</option>
                <option value="2">Reserva #2 - Mesa 7 - Pedro Sánchez</option>
                <option value="3">Reserva #3 - Mesa 2 - Luis Rodríguez</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select>
                <option value="confirmed">Confirmada</option>
                <option value="pending">Pendiente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notas</label>
              <input type="text" placeholder="Notas sobre la reserva" />
            </div>
          </form>
        </>
      }
      card-footer={
        <>
          <Button title="Cancelar" variant="secondary" />
          <Button title="Guardar" variant="primary" />
        </>
      }
    />
  )
}

export default ReservationForm
