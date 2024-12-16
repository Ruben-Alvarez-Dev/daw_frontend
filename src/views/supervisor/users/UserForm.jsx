import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const UserForm = () => {
  return (
    <Card
      card-header={<h3>Gestión de Usuario</h3>}
      card-body={
        <>
          <form className="user-form">
            <div className="form-group">
              <label>Usuario</label>
              <select>
                <option value="1">María García - Supervisor</option>
                <option value="2">Ana Martínez - Customer</option>
                <option value="3">Pedro Sánchez - Customer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notas</label>
              <input type="text" placeholder="Notas sobre el usuario" />
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

export default UserForm
