import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const UserList = () => {
  return (
    <Card
      card-header={<h3>Lista de Usuarios</h3>}
      card-body={
        <>
          <div className="user-list">
            <ul>
              <li>María García - Supervisor</li>
              <li>Ana Martínez - Customer</li>
              <li>Pedro Sánchez - Customer</li>
            </ul>
          </div>
        </>
      }
      card-footer={
        <>
          <Button title="Actualizar" variant="secondary" />
          <Button title="Gestionar Usuario" variant="primary" />
        </>
      }
    />
  )
}

export default UserList
