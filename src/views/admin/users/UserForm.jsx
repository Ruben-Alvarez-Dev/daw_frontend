import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './UserForm.css'

const UserForm = ({ user, onSave, onCancel }) => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    password: '',
    password_confirmation: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = user 
        ? `http://localhost:8000/api/users/${user.id}`
        : 'http://localhost:8000/api/users'
      
      const method = user ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al guardar usuario')
      }

      const savedUser = await response.json()
      onSave(savedUser)
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      card-header={
        <h3>{user ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
      }
      card-body={
        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="error-message">{error}</p>}
          
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="customer">Cliente</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {user ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!user}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">
              {user ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña'}
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required={!user}
            />
          </div>
        </form>
      }
      card-footer={
        <>
          <Button
            title="Cancelar"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            title={loading ? 'Guardando...' : 'Guardar'}
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          />
        </>
      }
    />
  )
}

export default UserForm
