import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './AdminTableSelector.css';

export default function AdminTableSelector() {
    const { token } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tables`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Error al cargar las mesas');
                const data = await response.json();
                setTables(data);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [token]);

    if (loading) return <div>Cargando...</div>;
    if (!tables?.length) return <div>No hay mesas registradas</div>;

    return (
        <div className="table-selector">
            {tables.map(table => (
                <div key={table.id} className="table-item">
                    <div className="table-item__title">Mesa {table.id}</div>
                    <div className="table-item__subtitle">{table.capacity} pax</div>
                </div>
            ))}
        </div>
    );
}
