import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const TableForm = () => {
  return (
    <Card
      card-header={<h3>Gestión de Mesa</h3>}
      card-body={
        <>
          <form className="table-form">
            <div className="form-group">
              <label>Mesa</label>
              <select>
                <option value="1">Mesa 1 - 4 personas</option>
                <option value="2">Mesa 2 - 2 personas</option>
                <option value="3">Mesa 3 - 6 personas</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select>
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notas</label>
              <input type="text" placeholder="Notas adicionales" />
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
