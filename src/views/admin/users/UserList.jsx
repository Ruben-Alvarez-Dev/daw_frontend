import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './UserList.css'

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [token])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cargar usuarios')
      }

      const data = await response.json()
      const usersArray = Array.isArray(data.data) ? data.data : []
      setUsers(usersArray)
      setError(null)
    } catch (err) {
      setError('Error al cargar la lista de usuarios')
      console.error('Error:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    if (onEdit) onEdit(user)
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchUsers()
  }

  const renderUserItem = (user) => (
    <>
      <div className="user-primary">
        <span className="user-name">{user.name}</span>
      </div>
      <div className="user-secondary">
        <span className="user-email">{user.email}</span>
      </div>
      <div className="user-tertiary">
        <span className={`user-role role-${user.role}`}>{user.role}</span>
      </div>
    </>
  )

  const renderUserList = () => {
    if (loading) return <p className="loading-message">Cargando usuarios...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!users || users.length === 0) return <p className="empty-message">No hay usuarios registrados</p>

    return (
      <List
        items={users}
        renderItem={renderUserItem}
        threeLines={true}
      />
    )
  }

  return (
    <Card
      card-header={<h2>Lista de Usuarios</h2>}
      card-body={renderUserList()}
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

export default UserList
