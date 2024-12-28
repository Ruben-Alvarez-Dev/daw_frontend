import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { createTable, updateTable } from '../../../services/api';
import './TableForm.css';

const TableForm = ({ restaurantId, table = null, onSubmit }) => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        number: table?.number || '',
        capacity: table?.capacity || '',
        status: table?.status || 'available'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (table) {
                await updateTable(token, restaurantId, table.id, formData);
            } else {
                await createTable(token, restaurantId, formData);
            }
            
            if (onSubmit) {
                onSubmit();
            } else {
                navigate(`/restaurants/${restaurantId}/tables`);
            }
        } catch (err) {
            setError('Error al guardar la mesa. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="table-form-container">
            <h2 className="table-form-title">
                {table ? 'Editar Mesa' : 'Nueva Mesa'}
            </h2>

            {error && (
                <div className="table-form-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="table-form">
                <div className="table-form-group">
                    <label className="table-form-label">
                        Número de Mesa
                    </label>
                    <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className="table-form-input"
                        required
                        min="1"
                    />
                </div>

                <div className="table-form-group">
                    <label className="table-form-label">
                        Capacidad
                    </label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="table-form-input"
                        required
                        min="1"
                    />
                </div>

                <div className="table-form-group">
                    <label className="table-form-label">
                        Estado
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="table-form-select"
                        required
                    >
                        <option value="available">Disponible</option>
                        <option value="occupied">Ocupada</option>
                        <option value="reserved">Reservada</option>
                        <option value="maintenance">Mantenimiento</option>
                    </select>
                </div>

                <div className="table-form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(`/restaurants/${restaurantId}/tables`)}
                        className="table-form-button table-form-button-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="table-form-button table-form-button-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (table ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TableForm;
