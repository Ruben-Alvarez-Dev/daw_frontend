import { useState } from 'react';
import AdminTableForm from './AdminTableForm';
import AdminTableList from './AdminTableList';
import Card from '../../common/Card/Card';

export default function AdminTables() {
    const [selectedTable, setSelectedTable] = useState(null);
    const [refreshList, setRefreshList] = useState(0);

    const handleSave = () => {
        setSelectedTable(null);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (table) => {
        setSelectedTable(table);
    };

    const handleCancel = () => {
        setSelectedTable(null);
    };

    return (
        <>
            <Card title="Nueva Mesa">
                <AdminTableForm
                    table={selectedTable}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </Card>
            <Card title="Mesas">
                <AdminTableList
                    onEdit={handleEdit}
                    key={refreshList}
                />
            </Card>
        </>
    );
}
