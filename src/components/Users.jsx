import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/api'
import UserList from './UserList'
import UserForm from './UserForm'

function Users() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchWithAuth('http://localhost:8000/api/users')
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors({})

      await fetchWithAuth('http://localhost:8000/api/users', {
        method: 'POST',
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          is_active: userData.is_active ?? true
        })
      })

      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      console.error('Error creating user:', err)
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors)
      } else {
        setError(err.message || 'Failed to create user')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      setValidationErrors({})

      const updateData = {
        name: userData.name,
        email: userData.email,
        is_active: userData.is_active ?? true
      }

      if (userData.password) {
        updateData.password = userData.password
      }

      await fetchWithAuth(`http://localhost:8000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      })

      setSelectedUser(null)
      await fetchUsers()
    } catch (err) {
      console.error('Error updating user:', err)
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors)
      } else {
        setError(err.message || 'Failed to update user')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true)
        setError(null)
        
        await fetchWithAuth(`http://localhost:8000/api/users/${userId}`, {
          method: 'DELETE'
        })

        setSelectedUser(null)
        await fetchUsers()
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('Failed to delete user')
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="users-container">
      <div className="users-layout">
        <div className="list-section">
          <UserList
            users={users}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
            onCreateNew={() => setSelectedUser({})}
          />
        </div>
        <div className="form-section">
          {(selectedUser || selectedUser === {}) && (
            <UserForm
              user={selectedUser?.id ? selectedUser : null}
              onSubmit={selectedUser?.id ? handleUpdate : handleCreate}
              onCancel={() => setSelectedUser(null)}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Users
