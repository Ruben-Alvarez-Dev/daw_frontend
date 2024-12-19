import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import { fetchRestaurants } from '../../../services/api'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './RestaurantList.css'

const RestaurantList = ({ onEdit }) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, refreshToken } = useAuth()

  useEffect(() => {
    loadRestaurants()
  }, [token])

  const loadRestaurants = async () => {
    if (!token) {
      setError('No hay sesión activa')
      setLoading(false)
      return
    }

    try {
      const data = await fetchRestaurants(token)
      setRestaurants(data)
      setError(null)
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          return loadRestaurants()
        }
        setError('Sesión expirada. Por favor, vuelva a iniciar sesión.')
      } else {
        setError(err.message)
      }
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (restaurant) => {
    if (onEdit) onEdit(restaurant)
  }

  const handleRefresh = () => {
    setLoading(true)
    loadRestaurants()
  }

  const renderRestaurantItem = (restaurant) => {
    const zones = restaurant.zones || ['main room'];
    return (
      <>
        <div className="restaurant-primary">
          <span className="restaurant-name">{restaurant.name}</span>
        </div>
        <div className="restaurant-secondary">
          <span className="restaurant-zones">
            Zonas: {Array.isArray(zones) ? zones.join(', ') : 'main room'}
          </span>
          <span className="restaurant-capacity">Capacidad: {restaurant.capacity || 50}</span>
        </div>
        <div className="restaurant-tertiary">
          <span className="restaurant-active">{restaurant.isActive ? 'Activo' : 'Inactivo'}</span>
          <span className="restaurant-status" data-status={restaurant.status}>{restaurant.status}</span>
        </div>
      </>
    );
  }

  const renderRestaurantList = () => {
    if (loading) return <p className="loading-message">Cargando restaurantes...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!restaurants || restaurants.length === 0) return <p className="empty-message">No hay restaurantes registrados</p>

    return (
      <List
        items={restaurants}
        renderItem={renderRestaurantItem}
        threeLines={true}
      />
    )
  }

  return (
    <Card
      card-header={<h3>Lista de Restaurantes</h3>}
      card-body={renderRestaurantList()}
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

export default RestaurantList
