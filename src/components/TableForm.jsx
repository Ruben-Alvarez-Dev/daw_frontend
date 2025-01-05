import { useState, useEffect } from 'react'
import './UserForm.css'

function TableForm({ table, onSubmit, onCancel, validationErrors = {} }) {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    is_active: true
  })

  useEffect(() => {
    if (table) {
      setFormData({
        name: table.name || '',
        capacity: table.capacity || '',
        is_active: table.is_active ?? true
      })
    } else {
      setFormData({
        name: '',
        capacity: '',
        is_active: true
      })
    }
  }, [table])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'capacity' ? (value === '' ? '' : parseInt(value, 10)) :
              value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form submission:', {
      formData,
      isUpdate: !!table
    })
    
    // Validación básica
    if (!formData.name || formData.name.trim() === '') {
      return
    }
    
    // Asegurarse de que capacity sea un número
    const dataToSubmit = {
      ...formData,
      capacity: parseInt(formData.capacity, 10)
    }
    
    try {
      console.log('Submitting data:', dataToSubmit)
      await onSubmit(dataToSubmit)
    } catch (err) {
      console.error('Error submitting form:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{table ? 'Edit Table' : 'Create Table'}</h2>

      <div className="form-group">
        <label htmlFor="name">Table Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={validationErrors.name ? 'error' : ''}
          required
        />
        {validationErrors.name && (
          <div className="error-message">{validationErrors.name}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity:</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          className={validationErrors.capacity ? 'error' : ''}
          min="1"
          required
        />
        {validationErrors.capacity && (
          <div className="error-message">{validationErrors.capacity}</div>
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
          <div className="error-message">{validationErrors.is_active}</div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary">
          {table ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="btn secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TableForm
