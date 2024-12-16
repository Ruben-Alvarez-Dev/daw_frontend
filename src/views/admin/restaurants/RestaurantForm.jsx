import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './RestaurantForm.css'

const RestaurantForm = ({ restaurant, onSave, onCancel }) => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    capacity: '',
    opening_hours: '',
    closing_hours: '',
    status: 'active'
  })

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        type: restaurant.type,
        location: restaurant.location,
        capacity: restaurant.capacity,
        opening_hours: restaurant.opening_hours,
        closing_hours: restaurant.closing_hours,
        status: restaurant.status
      })
    }
  }, [restaurant])

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
      const url = restaurant 
        ? `http://localhost:8000/api/restaurants/${restaurant.id}`
        : 'http://localhost:8000/api/restaurants'
      
      const method = restaurant ? 'PUT' : 'POST'
      
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
        throw new Error(errorData.message || 'Error al guardar restaurante')
      }

      const savedRestaurant = await response.json()
      onSave(savedRestaurant)
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
        <h3>{restaurant ? 'Editar Restaurante' : 'Nuevo Restaurante'}</h3>
      }
      card-body={
        <form onSubmit={handleSubmit} className="restaurant-form">
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
            <label htmlFor="type">Tipo de Cocina</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Ubicación</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacidad</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="opening_hours">Hora de Apertura</label>
              <input
                type="time"
                id="opening_hours"
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="closing_hours">Hora de Cierre</label>
              <input
                type="time"
                id="closing_hours"
                name="closing_hours"
                value={formData.closing_hours}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="pending">Pendiente</option>
            </select>
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

export default RestaurantForm
