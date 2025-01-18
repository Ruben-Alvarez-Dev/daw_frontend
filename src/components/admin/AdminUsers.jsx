import { useRef, useState } from 'react';
import AdminUserList from './AdminUserList';
import AdminUserForm from './AdminUserForm';

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null);
  const listRef = useRef();

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleSave = () => {
    setSelectedUser(null);
    listRef.current?.refresh();
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
      
      <AdminUserForm
        user={selectedUser}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <AdminUserList
        ref={listRef}
        onEdit={handleEdit}
      />
    </div>
  );
}
