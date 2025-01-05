import { useState, useEffect } from 'react'
import './UserForm.css'

function UserForm({ user, onSubmit, onCancel, validationErrors = {} }) {
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    is_active: true
  }

  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        is_active: user.is_active ?? true
      })
    } else {
      setFormData(initialFormData)
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="user-form-container">
      <h2>{user ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={validationErrors.name ? 'error' : ''}
          />
          {validationErrors.name && (
            <div className="error-message">{validationErrors.name[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={validationErrors.email ? 'error' : ''}
          />
          {validationErrors.email && (
            <div className="error-message">{validationErrors.email[0]}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {user ? 'New Password (leave empty to keep current):' : 'Password:'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!user}
            className={validationErrors.password ? 'error' : ''}
          />
          {validationErrors.password && (
            <div className="error-message">{validationErrors.password[0]}</div>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Active
          </label>
          {validationErrors.is_active && (
            <div className="error-message">{validationErrors.is_active[0]}</div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {user ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserForm
