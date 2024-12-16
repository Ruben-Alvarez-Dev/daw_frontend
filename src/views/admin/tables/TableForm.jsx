import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const TableForm = () => {
  return (
    <Card
      card-header={<h3>Formulario de Mesa</h3>}
      card-body={
        <>
          <form className="table-form">
            <div className="form-group">
              <label>Número de Mesa</label>
              <input type="number" placeholder="Número de mesa" />
            </div>
            <div className="form-group">
              <label>Capacidad</label>
              <input type="number" placeholder="Número de personas" />
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select>
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
              </select>
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

export default TableForm
