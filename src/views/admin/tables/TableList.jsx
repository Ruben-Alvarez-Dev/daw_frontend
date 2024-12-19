import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { fetchTables } from '../../../services/api'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './TableList.css'

const TableList = ({ onEdit }) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, refreshToken } = useAuth()

  useEffect(() => {
    loadTables()
  }, [token])

  const loadTables = async () => {
    if (!token) {
      setError('No hay sesión activa')
      setLoading(false)
      return
    }

    try {
      const data = await fetchTables(token)
      setTables(data)
      setError(null)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadTables()
        }
        setError('Sesión expirada. Por favor, vuelva a iniciar sesión.')
      } else {
        setError(err.message)
      }
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
