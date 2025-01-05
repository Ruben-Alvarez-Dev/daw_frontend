import { useState, useEffect } from 'react'
import { fetchWithAuth } from '../utils/api'
import './UserForm.css'

function ReservationForm({ reservation, onSubmit, onCancel, validationErrors = {} }) {
  const [tables, setTables] = useState([])
  const [formData, setFormData] = useState({
    table_id: '',
    datetime: '',
    guests: '',
    status: 'pending',
    is_active: true
  })

  useEffect(() => {
    // Cargar las mesas disponibles
    const loadTables = async () => {
      try {
        const data = await fetchWithAuth('http://localhost:8000/api/tables')
        setTables(data)
      } catch (err) {
        console.error('Error loading tables:', err)
      }
    }
    loadTables()
  }, [])

  useEffect(() => {
    if (reservation) {
      // Convertir datetime a formato local para el input
      const datetime = new Date(reservation.datetime)
      const formattedDatetime = datetime.toISOString().slice(0, 16) // formato "YYYY-MM-DDTHH:mm"

      setFormData({
        table_id: reservation.table_id || '',
        datetime: formattedDatetime,
        guests: reservation.guests || '',
        status: reservation.status || 'pending',
        is_active: reservation.is_active ?? true
      })
    } else {
      setFormData({
        table_id: '',
        datetime: '',
        guests: '',
        status: 'pending',
        is_active: true
      })
    }
  }, [reservation])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              name === 'guests' ? (value === '' ? '' : parseInt(value, 10)) :
              value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h2>{reservation ? 'Edit Reservation' : 'Create Reservation'}</h2>

      <div className="form-group">
        <label htmlFor="table_id">Table:</label>
        <select
          id="table_id"
          name="table_id"
          value={formData.table_id}
          onChange={handleChange}
          className={validationErrors.table_id ? 'error' : ''}
          required
        >
          <option value="">Select a table</option>
          {tables.map(table => (
            <option key={table.id} value={table.id}>
              {table.name} (Capacity: {table.capacity})
            </option>
          ))}
        </select>
        {validationErrors.table_id && (
          <div className="error-message">{validationErrors.table_id[0]}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="datetime">Date and Time:</label>
        <input
          type="datetime-local"
          id="datetime"
          name="datetime"
          value={formData.datetime}
          onChange={handleChange}
          className={validationErrors.datetime ? 'error' : ''}
          required
        />
        {validationErrors.datetime && (
          <div className="error-message">{validationErrors.datetime[0]}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="guests">Number of Guests:</label>
        <input
          type="number"
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          className={validationErrors.guests ? 'error' : ''}
          min="1"
          required
        />
        {validationErrors.guests && (
          <div className="error-message">{validationErrors.guests[0]}</div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={validationErrors.status ? 'error' : ''}
          required
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="seated">Seated</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
        {validationErrors.status && (
          <div className="error-message">{validationErrors.status[0]}</div>
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
        <button type="submit" className="btn primary">
          {reservation ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="btn secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ReservationForm
