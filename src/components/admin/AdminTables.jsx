import { useRef, useState } from 'react';
import AdminTableList from './AdminTableList';
import AdminTableForm from './AdminTableForm';

export default function AdminTables() {
  const [selectedTable, setSelectedTable] = useState(null);
  const listRef = useRef();

  const handleEdit = (table) => {
    setSelectedTable(table);
  };

  const handleSave = () => {
    setSelectedTable(null);
    listRef.current?.refresh();
  };

  const handleCancel = () => {
    setSelectedTable(null);
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Gestión de Mesas</h1>
      
      <AdminTableForm
        table={selectedTable}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <AdminTableList
        ref={listRef}
        onEdit={handleEdit}
        selectedId={selectedTable?.id}
      />
    </div>
  );
}
