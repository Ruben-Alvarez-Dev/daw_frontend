import './Home.css'

const restaurantData = [
  {
    id: 1,
    name: "El Rincón del Sabor",
    image: "/images/restaurant1.jpg",
    cuisine: "Mediterránea",
    rating: 4.5,
    description: "Auténtica cocina mediterránea en un ambiente acogedor"
  },
  {
    id: 2,
    name: "Sushi Master",
    image: "/images/restaurant2.jpg",
    cuisine: "Japonesa",
    rating: 4.8,
    description: "La mejor experiencia en sushi y cocina japonesa"
  },
  {
    id: 3,
    name: "La Parrilla",
    image: "/images/restaurant3.jpg",
    cuisine: "Carnes",
    rating: 4.6,
    description: "Especialistas en carnes a la brasa y parrilla"
  },
  {
    id: 4,
    name: "Pasta & Love",
    image: "/images/restaurant4.jpg",
    cuisine: "Italiana",
    rating: 4.7,
    description: "Pasta artesanal y auténtica cocina italiana"
  }
]

const Home = () => {
  return (
    <main className="restaurants">
      {restaurantData.map(restaurant => (
        <article key={restaurant.id}>
          <img src={restaurant.image} alt={restaurant.name} />
          <h2>{restaurant.name}</h2>
          <p>{restaurant.cuisine}</p>
          <span>⭐ {restaurant.rating}</span>
          <p>{restaurant.description}</p>
        </article>
      ))}
    </main>
  )
}

export default Home