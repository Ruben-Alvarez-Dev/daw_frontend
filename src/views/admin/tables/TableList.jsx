import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './TableList.css'

const TableList = ({ onEdit }) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchTables()
  }, [token])

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tables', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cargar mesas')
      }

      const data = await response.json()
      const tablesArray = Array.isArray(data.data) ? data.data : []
      setTables(tablesArray)
      setError(null)
    } catch (err) {
      setError('Error al cargar la lista de mesas')
      console.error('Error:', err)
      setTables([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (table) => {
    if (onEdit) onEdit(table)
  }

  const renderTableItem = (table) => (
    <>
      <div className="table-primary">
        <span className="table-number">Mesa {table.number}</span>
      </div>
      <div className="table-secondary">
        <span className="table-restaurant">Restaurante: {table.restaurant?.name || 'No asignado'}</span>
        <span className="table-capacity">Capacidad: {table.capacity || 4}</span>
      </div>
      <div className="table-tertiary">
        <span className="table-status" data-status={table.status}>{table.status}</span>
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
