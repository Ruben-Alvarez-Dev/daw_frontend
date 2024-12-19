import { useEffect } from 'react'
import { useApp } from '../../../contexts/AppContext/AppContext'
import Card from '../../../components/ui/Card/Card'
import Button from '../../../components/ui/Button/Button'
import List from '../../../components/ui/List/List'
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
    console.log('Restaurant clicked:', restaurant)
    console.log('Current active restaurant:', activeItems.restaurant)
    
    if (activeItems.restaurant && activeItems.restaurant.id_restaurant === restaurant.id_restaurant) {
      console.log('Deactivating restaurant')
      setActiveItem('restaurant', null)
    } else {
      console.log('Activating restaurant')
      setActiveItem('restaurant', restaurant)
    }
  }

  const renderRestaurantItem = (restaurant) => (
    <>
      <div className="restaurant-primary">
        <span className="restaurant-name">{restaurant.name}</span>
      </div>
      <div className="restaurant-secondary">
        <span className="restaurant-zones">{restaurant.zones?.join(', ') || 'Sin zonas'}</span>
      </div>
      <div className="restaurant-tertiary">
        <span className="restaurant-capacity">Capacidad: {restaurant.capacity}</span>
      </div>
    </>
  )

  const renderRestaurantList = () => {
    if (loading) return <p className="loading-message">Cargando restaurantes...</p>
    if (error) return <p className="error-message">{error}</p>
    if (!restaurants || restaurants.length === 0) return <p className="empty-message">No hay restaurantes registrados</p>

    return (
      <List
        items={restaurants}
        renderItem={renderRestaurantItem}
        threeLines={true}
        activeItem={activeItems.restaurant}
        onItemClick={handleItemClick}
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
