import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AdminTableList.css';

export default function AdminTableList({ onEdit, onDelete, refresh, tables, setTables, selectedTable, onSelect, onFilteredCountChange }) {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Error al cargar mesas');
                const data = await response.json();
                setTables(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, [refresh, token, setTables]);

    const filteredTables = tables.filter(table => {
        const searchLower = searchTerm.toLowerCase();
        return table.name.toLowerCase().includes(searchLower) ||
               table.capacity.toString().includes(searchLower) ||
               table.status.toLowerCase().includes(searchLower);
    });

    useEffect(() => {
        onFilteredCountChange(filteredTables.length);
    }, [filteredTables.length, onFilteredCountChange]);

    if (loading) return <div className="table-list-message">Cargando mesas...</div>;
    if (error) return <div className="table-list-message error">{error}</div>;
    if (!tables.length) return <div className="table-list-message">No hay mesas registradas</div>;

    return (
        <div className="table-list">
            <div className="table-list-search">
                <input
                    type="text"
                    placeholder="Buscar mesas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="table-list-content">
                {filteredTables.map(table => (
                    <div 
                        key={table.id} 
                        className={`table-list-item ${selectedTable?.id === table.id ? 'selected' : ''}`}
                        onClick={() => onSelect(table)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="table-info">
                            <div className="table-name">#{table.id} - {table.name}</div>
                            <div className="table-details">
                                <span>Capacidad: {table.capacity}</span>
                                <span className={`table-status status-${table.status}`}>
                                    {table.status === 'available' ? 'Disponible' : 
                                     table.status === 'blocked' ? 'Bloqueada' : 'No disponible'}
                                </span>
                            </div>
                        </div>
                        <div className="table-actions">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(table);
                                }} 
                                className="action-button"
                            >
                                Editar
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(table);
                                }} 
                                className="action-button delete"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
