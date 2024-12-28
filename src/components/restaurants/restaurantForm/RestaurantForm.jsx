import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getRestaurant, createRestaurant, updateRestaurant } from '../../../services/api';
import './RestaurantForm.css';

const RestaurantForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        restaurant_name: '',
        restaurant_supervisor_id: user?.id || '',
        restaurant_max_capacity: '',
        restaurant_starttime: '',
        restaurant_endtime: '',
        restaurant_intervals: '30'
    });

    useEffect(() => {
        if (id) {
            const fetchRestaurant = async () => {
                try {
                    const data = await getRestaurant(getToken(), id);
                    setFormData(data);
                } catch (err) {
                    setError('Error al cargar el restaurante');
                }
            };
            fetchRestaurant();
        }
    }, [id, getToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (id) {
                await updateRestaurant(getToken(), id, formData);
            } else {
                await createRestaurant(getToken(), formData);
            }
            navigate('/restaurants');
        } catch (err) {
            setError('Error al guardar el restaurante');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div className="text-center p-4">Guardando...</div>;

    return (
        <div className="max-w-md mx-auto mt-8 p-4">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl mb-4">
                    {id ? 'Editar Restaurante' : 'Nuevo Restaurante'}
                </h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="card p-4 border rounded">
                        <label className="block mb-1">Nombre</label>
                        <input
                            type="text"
                            name="restaurant_name"
                            value={formData.restaurant_name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="card p-4 border rounded">
                        <label className="block mb-1">Capacidad Máxima</label>
                        <input
                            type="number"
                            name="restaurant_max_capacity"
                            value={formData.restaurant_max_capacity}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="card p-4 border rounded">
                        <label className="block mb-1">Horario</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Apertura</label>
                                <input
                                    type="time"
                                    name="restaurant_starttime"
                                    value={formData.restaurant_starttime}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Cierre</label>
                                <input
                                    type="time"
                                    name="restaurant_endtime"
                                    value={formData.restaurant_endtime}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card p-4 border rounded">
                        <label className="block mb-1">Intervalo de Reservas</label>
                        <select
                            name="restaurant_intervals"
                            value={formData.restaurant_intervals}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="15">15 minutos</option>
                            <option value="30">30 minutos</option>
                            <option value="60">1 hora</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/restaurants')}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={loading}
                        >
                            {id ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RestaurantForm;
