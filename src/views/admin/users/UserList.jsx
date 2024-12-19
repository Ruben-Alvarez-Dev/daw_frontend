import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './UserList.css'

const UserList = ({ onEdit }) => {
  const { 
    data: { users },
    loading: { users: loading },
    errors: { users: error },
    activeItems,
    setActiveItem,
    loadUsers
  } = useApp()

  useEffect(() => {
    loadUsers()
  }, [])

  const handleEdit = (user) => {
    if (onEdit) onEdit(user)
  }

  const handleItemClick = (user) => {
    if (activeItems.user?.id === user.id) {
      setActiveItem('user', null)
    } else {
      setActiveItem('user', user)
    }
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
        itemType="user"
        activeItem={activeItems.user}
        onItemClick={handleItemClick}
      />
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Usuarios</h3>}
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
