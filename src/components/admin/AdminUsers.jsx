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
    <div className="admin-page">
      <h1 className="admin-page__title">Gestión de Usuarios</h1>
      
      <AdminUserForm
        user={selectedUser}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <AdminUserList
        ref={listRef}
        onEdit={handleEdit}
        selectedId={selectedUser?.id}
      />
    </div>
  );
}
