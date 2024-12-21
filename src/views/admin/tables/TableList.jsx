import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './TableList.css'

const TableList = ({ onEdit }) => {
  const { 
    data: { tables },
    loading: { tables: loading },
    errors: { tables: error },
    activeItems,
    setActiveItem,
    loadTables
  } = useApp()

  useEffect(() => {
    loadTables()
  }, [])

  const handleEdit = (table) => {
    if (onEdit) onEdit(table)
  }

  const handleItemClick = (table) => {
    if (activeItems.table && activeItems.table.id_table === table.id_table) {
      setActiveItem('table', null)
    } else {
      setActiveItem('table', table)
    }
  }

  const renderTableList = () => {
    if (loading) return <p className="loading-message">Cargando mesas...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!tables || tables.length === 0) return <p className="empty-message">No hay mesas registradas</p>

    return (
      <ul className="tables-list">
        {tables.map((table) => (
          <li 
            key={table.id_table}
            className={`table-item ${activeItems.table?.id_table === table.id_table ? 'active' : ''}`}
            onClick={() => handleItemClick(table)}
          >
            <div className="table-primary">
              <span className="table-number">Mesa {table.number}</span>
              <span className="table-status">{table.status}</span>
            </div>
            <div className="table-secondary">
              <span className="table-restaurant">{table.restaurant?.name || 'Sin restaurante'}</span>
              <span className="table-zone">{table.zone || 'Sin zona'}</span>
            </div>
            <div className="table-tertiary">
              <span className="table-capacity">Capacidad: {table.capacity}</span>
              <span className="table-id">ID: {table.id_table}</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Mesas</h3>}
      card-body={renderTableList()}
      card-footer={
        <Button 
          title="Nuevo" 
          variant="primary" 
          onClick={() => handleEdit(null)}
        />
      }
    />
  )
}

export default TableList
