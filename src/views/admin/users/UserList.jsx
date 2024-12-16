import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './UserList.css'

const UserList = ({ onEdit }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [token]) // Añadido token como dependencia

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
      // Asegurarse de que data.data existe y es un array
      const usersArray = Array.isArray(data.data) ? data.data : []
      setUsers(usersArray)
      setError(null)
    } catch (err) {
      setError('Error al cargar la lista de usuarios')
      console.error('Error:', err)
      setUsers([]) // Resetear a array vacío en caso de error
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

  const renderUserList = () => {
    if (loading) return <p className="loading-message">Cargando usuarios...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!users || users.length === 0) return <p className="empty-message">No hay usuarios registrados</p>

    return (
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
              <span className={`user-role role-${user.role}`}>{user.role}</span>
            </div>
            <div className="user-actions">
              <Button 
                title="Editar" 
                variant="secondary" 
                onClick={() => handleEdit(user)}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Usuarios</h3>}
      card-body={renderUserList()}
      card-footer={
        <>
          <Button 
            title="Actualizar" 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={loading}
          />
          <Button 
            title="Añadir Usuario" 
            variant="primary" 
            onClick={() => handleEdit(null)}
          />
        </>
      }
    />
  )
}

export default UserList
