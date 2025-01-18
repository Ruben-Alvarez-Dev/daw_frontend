import { useRef, useState } from 'react';
import AdminTableList from './AdminTableList';
import AdminTableForm from './AdminTableForm';

export default function AdminTables() {
  const [editingTable, setEditingTable] = useState(null);
  const listRef = useRef();

  const handleTableCreated = () => {
    if (listRef.current) {
      listRef.current.refresh();
    }
    setEditingTable(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Mesas</h1>
      
      <AdminTableForm
        editingTable={editingTable}
        onTableCreated={handleTableCreated}
      />

      <AdminTableList
        ref={listRef}
        onEdit={setEditingTable}
      />
    </div>
  );
}
