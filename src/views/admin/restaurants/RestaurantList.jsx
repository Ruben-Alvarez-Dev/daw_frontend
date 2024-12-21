import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import './RestaurantList.css'

const RestaurantList = ({ onEdit }) => {
  const { 
    data: { restaurants },
    loading: { restaurants: loading },
    errors: { restaurants: error },
    activeItems,
    setActiveItem,
    loadRestaurants
  } = useApp()

  useEffect(() => {
    loadRestaurants()
  }, [])

  const handleEdit = (restaurant) => {
    if (onEdit) onEdit(restaurant)
  }

  const handleItemClick = (restaurant) => {
    if (activeItems.restaurant && activeItems.restaurant.id_restaurant === restaurant.id_restaurant) {
      setActiveItem('restaurant', null)
    } else {
      setActiveItem('restaurant', restaurant)
    }
  }

  const renderRestaurantList = () => {
    if (loading) return <p className="loading-message">Cargando restaurantes...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!restaurants || restaurants.length === 0) return <p className="empty-message">No hay restaurantes registrados</p>

    return (
      <ul className="restaurants-list">
        {restaurants.map((restaurant) => {
          // Parse zones if it's a JSON string
          const zones = restaurant.zones ? 
            (typeof restaurant.zones === 'string' ? JSON.parse(restaurant.zones) : restaurant.zones) 
            : [];

          return (
            <li 
              key={restaurant.id_restaurant}
              className={`restaurant-item ${activeItems.restaurant?.id_restaurant === restaurant.id_restaurant ? 'active' : ''}`}
              onClick={() => handleItemClick(restaurant)}
            >
              <div className="restaurant-primary">
                <span className="restaurant-name">{restaurant.name}</span>
              </div>
              <div className="restaurant-secondary">
                <span className="restaurant-zones">{zones.join(', ') || 'Sin zonas'}</span>
              </div>
              <div className="restaurant-tertiary">
                <span className="restaurant-capacity">Capacidad: {restaurant.capacity}</span>
                <span className={`restaurant-status status-${restaurant.status.replace(' ', '-')}`}>
                  {restaurant.status}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
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
