import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const ReservationForm = () => {
  return (
    <Card
      card-header={<h3>Nueva Reserva</h3>}
      card-body={
        <>
          <form className="reservation-form">
            <div className="form-group">
              <label>Restaurante</label>
              <select>
                <option value="1">La Parrilla</option>
                <option value="2">El Pescador</option>
                <option value="3">Veggie Garden</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" />
            </div>
            <div className="form-group">
              <label>Hora</label>
              <input type="time" />
            </div>
            <div className="form-group">
              <label>Número de Personas</label>
              <input type="number" placeholder="Número de comensales" />
            </div>
            <div className="form-group">
              <label>Notas Especiales</label>
              <input type="text" placeholder="Alergias, preferencias, etc." />
            </div>
          </form>
        </>
      }
      card-footer={
        <>
          <Button title="Cancelar" variant="secondary" />
          <Button title="Reservar" variant="primary" />
        </>
      }
    />
  )
}

export default ReservationForm
