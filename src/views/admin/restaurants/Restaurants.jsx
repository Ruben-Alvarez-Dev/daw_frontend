import { useState } from 'react'
import RestaurantList from './RestaurantList'
import RestaurantForm from './RestaurantForm'

const Restaurants = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleSave = () => {
    setSelectedRestaurant(null)
  }

  const handleCancel = () => {
    setSelectedRestaurant(null)
  }

  return (
    <>
      <RestaurantList onEdit={handleEdit} />
      <RestaurantForm
        restaurant={selectedRestaurant}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  )
}

export default Restaurants
