import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getRestaurants } from '../../../services/api';
import './RestaurantList.css';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants(getToken());
                setRestaurants(data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los restaurantes');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [getToken]);

    if (loading) return <div className="text-center p-4">Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl">Restaurantes</h2>
                <button
                    onClick={() => navigate('/restaurants/new')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Nuevo Restaurante
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {restaurants.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg border">
                    <p>No hay restaurantes disponibles</p>
                    <button
                        onClick={() => navigate('/restaurants/new')}
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        Crear el primer restaurante
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.restaurant_id}
                            className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl mb-2">{restaurant.restaurant_name}</h3>
                            <div className="space-y-2 mb-4">
                                <p className="flex items-center">
                                    <span className="w-24">Capacidad:</span>
                                    <span>{restaurant.restaurant_max_capacity} personas</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-24">Horario:</span>
                                    <span>{restaurant.restaurant_starttime} - {restaurant.restaurant_endtime}</span>
                                </p>
                                <p className="flex items-center">
                                    <span className="w-24">Intervalo:</span>
                                    <span>{restaurant.restaurant_intervals} minutos</span>
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}/zones`)}
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Zonas
                                </button>
                                <button
                                    onClick={() => navigate(`/restaurants/${restaurant.restaurant_id}/edit`)}
                                    className="px-3 py-1 border rounded hover:bg-gray-100"
                                >
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
