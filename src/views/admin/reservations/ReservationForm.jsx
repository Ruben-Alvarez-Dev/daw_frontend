import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const ReservationForm = () => {
  return (
    <Card
      card-header={<h3>Formulario de Reserva</h3>}
      card-body={
        <>
          <form className="reservation-form">
            <div className="form-group">
              <label>Mesa</label>
              <select>
                <option value="1">Mesa 1 - 4 personas</option>
                <option value="2">Mesa 2 - 2 personas</option>
                <option value="3">Mesa 3 - 6 personas</option>
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
