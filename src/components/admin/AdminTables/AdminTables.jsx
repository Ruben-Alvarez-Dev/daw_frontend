import { useState } from 'react';
import Card from '../../common/Card/Card';
import AdminTableList from './AdminTableList';
import AdminTableForm from './AdminTableForm';
import './AdminTables.css';

export default function AdminTables() {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleEdit = (table) => {
    setSelectedTable(table);
  };

  const handleSave = () => {
    setSelectedTable(null);
  };

  const handleCancel = () => {
    setSelectedTable(null);
  };

  return (
    <>
      <div className="admin-tables">
        <Card header={<h3>Nueva Mesa</h3>}>
          <AdminTableForm
            table={selectedTable}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>

        <Card header={<h3>Lista de Mesas</h3>}>
          <AdminTableList
            onEdit={handleEdit}
          />
        </Card>
      </div>
    </>
  );
}
