import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { fetchUsers } from '../../../services/api'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './UserList.css'

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, refreshToken } = useAuth()

  useEffect(() => {
    loadUsers()
  }, [token])

  const loadUsers = async () => {
    if (!token) {
      setError('No hay sesión activa')
      setLoading(false)
      return
    }

    try {
      const data = await fetchUsers(token)
      setUsers(data)
      setError(null)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadUsers()
        }
        setError('Sesión expirada. Por favor, vuelva a iniciar sesión.')
      } else {
        setError(err.message)
      }
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
    loadUsers()
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
      card-header={<h3>Lista de Usuarios</h3>}
      card-body={renderUserList()}
      card-footer={
        <div>
          <Button 
            title="Nuevo" 
            variant="primary" 
            onClick={() => handleEdit(null)}
          />
          <Button 
            title="Actualizar" 
            variant="secondary" 
            onClick={handleRefresh}
          />
        </div>
      }
    />
  )
}

export default UserList
