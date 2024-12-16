import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'

const TableList = () => {
  return (
    <Card
      card-header={<h3>Lista de Mesas</h3>}
      card-body={
        <>
          <div className="table-list">
            <ul>
              <li>Mesa 1 - 4 personas - Disponible</li>
              <li>Mesa 2 - 2 personas - Ocupada</li>
              <li>Mesa 3 - 6 personas - Reservada</li>
            </ul>
          </div>
        </>
      }
      card-footer={
        <>
          <Button title="Actualizar" variant="secondary" />
          <Button title="Gestionar Mesa" variant="primary" />
        </>
      }
    />
  )
}

export default TableList
