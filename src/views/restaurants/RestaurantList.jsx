import { useState, useEffect } from 'react';
import { getRestaurants } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './RestaurantList.css';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants(token);
                setRestaurants(data);
            } catch (err) {
                setError('Error al cargar los restaurantes');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [token]);

    if (loading) return <div>Cargando restaurantes...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="restaurant-list">
            <h1 className="restaurant-list-title">Restaurantes</h1>
            <div className="restaurant-list-content">
                <table className="restaurant-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map(restaurant => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.phone}</td>
                                <td>
                                    <button className="button button-secondary">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RestaurantList;
