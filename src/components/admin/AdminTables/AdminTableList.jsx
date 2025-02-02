import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../common/Card/Card';
import List from '../../common/List/List';
import Searchbar from '../../common/Searchbar/Searchbar';
import './AdminTableList.css';

export default function AdminTableList({ onEdit }) {
    const [tables, setTables] = useState([]);
    const [filteredTables, setFilteredTables] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const fetchTables = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const tablesList = Array.isArray(data) ? data : [];
            setTables(tablesList);
            setFilteredTables(tablesList);
            setError('');
        } catch (err) {
            console.error('Error fetching tables:', err);
            setError('Error al cargar mesas: ' + err.message);
            setTables([]);
            setFilteredTables([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTables();
        }
    }, [token]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        const term = value.toLowerCase().trim();
        
        if (!term) {
            setFilteredTables(tables);
            return;
        }

        const filtered = tables.filter(table => 
            table.name.toLowerCase().includes(term) ||
            table.capacity.toString().includes(term) ||
            table.status.toLowerCase().includes(term)
        );
        setFilteredTables(filtered);
    };

    const handleDelete = async (table) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar la mesa ${table.name}?`)) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables/${table.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            await fetchTables();
            setError('');
        } catch (err) {
            console.error('Error deleting table:', err);
            setError('Error al eliminar mesa: ' + err.message);
        }
    };

    const renderItem = (table) => (
        <>
            <div className="table-header">
                <span>#{table.id}</span>
                <span className={`table-status status-${table.status}`}>
                    {table.status}
                </span>
            </div>
            <div className="table-details">
                <div><strong>Nombre:</strong> {table.name}</div>
                <div><strong>Capacidad:</strong> {table.capacity} personas</div>
            </div>
        </>
    );

    return (
        <Card
            title="Mesas"
            actions={
                <Searchbar 
                    placeholder="Buscar mesas..." 
                    onSearch={handleSearch}
                    value={searchTerm}
                />
            }
        >
            <List
                items={filteredTables}
                renderItem={renderItem}
                onEdit={onEdit}
                onDelete={handleDelete}
                loading={loading}
                error={error}
                emptyMessage="No hay mesas registradas"
            />
        </Card>
    );
}
