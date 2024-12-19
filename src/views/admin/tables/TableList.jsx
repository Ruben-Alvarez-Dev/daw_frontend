import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
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

  const renderTableItem = (table) => (
    <>
      <div className="table-primary">
        <span className="table-number">Mesa {table.number}</span>
      </div>
      <div className="table-secondary">
        <span className="table-restaurant">{table.restaurant?.name || 'Sin restaurante'}</span>
      </div>
      <div className="table-tertiary">
        <span className="table-capacity">Capacidad: {table.capacity}</span>
      </div>
    </>
  )

  const renderTableList = () => {
    if (loading) return <p className="loading-message">Cargando mesas...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!tables || tables.length === 0) return <p className="empty-message">No hay mesas registradas</p>

    return (
      <List
        items={tables}
        renderItem={renderTableItem}
        threeLines={true}
        activeItem={activeItems.table}
        onItemClick={handleItemClick}
      />
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
