import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminTableForm from './AdminTableForm';
import AdminTableList from './AdminTableList';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import './AdminTables.css';

export default function AdminTables() {
    const [selectedTable, setSelectedTable] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshList, setRefreshList] = useState(0);
    const [tables, setTables] = useState([]);
    const [filteredCount, setFilteredCount] = useState(0);
    const { token } = useAuth();

    const handleSave = () => {
        setSelectedTable(null);
        setIsEditing(false);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (table) => {
        setSelectedTable(table);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSelectedTable(null);
        setIsEditing(false);
    };

    const handleSelect = (table) => {
        if (table.id === selectedTable?.id) {
            setSelectedTable(null);
        } else {
            setSelectedTable(table);
            setIsEditing(false);
        }
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
                throw new Error('Error al eliminar la mesa');
            }

            setRefreshList(prev => prev + 1);
        } catch (err) {
            console.error('Error deleting table:', err);
            alert('Error al eliminar la mesa: ' + err.message);
        }
    };

    const handleFilteredCountChange = (count) => {
        setFilteredCount(count);
    };

    return (
        <div className="admin-tables">
            <Card
                header="Nueva Mesa"
                body={
                    <AdminTableForm
                        table={selectedTable}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isEditing={isEditing}
                    />
                }
                footer={
                    <Button onClick={handleCancel} variant="secondary">
                        Limpiar
                    </Button>
                }
            />
            <Card
                header="Lista de Mesas"
                body={
                    <AdminTableList
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        refresh={refreshList}
                        tables={tables}
                        setTables={setTables}
                        selectedTable={selectedTable}
                        onSelect={handleSelect}
                        onFilteredCountChange={handleFilteredCountChange}
                    />
                }
                footer={`Total: ${filteredCount} ${filteredCount === 1 ? 'mesa' : 'mesas'}`}
            />
        </div>
    );
}
