import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext/AuthContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
import './RestaurantList.css'

const RestaurantList = ({ onEdit }) => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    fetchRestaurants()
  }, [token]) // Añadido token como dependencia

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al cargar restaurantes')
      }

      const data = await response.json()
      // Asegurarse de que data.data existe y es un array
      const restaurantsArray = Array.isArray(data.data) ? data.data : []
      setRestaurants(restaurantsArray)
      setError(null)
    } catch (err) {
      setError('Error al cargar la lista de restaurantes')
      console.error('Error:', err)
      setRestaurants([]) // Resetear a array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (restaurant) => {
    if (onEdit) onEdit(restaurant)
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchRestaurants()
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
        <Button 
          title="Nuevo" 
          variant="primary" 
          onClick={() => handleEdit(null)}
        />
      }
    />
  )
}

export default RestaurantList
