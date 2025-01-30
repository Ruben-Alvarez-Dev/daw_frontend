import { useState } from 'react';
import Card from '../../common/Card/Card';
import AdminUserList from './AdminUserList';
import AdminUserForm from './AdminUserForm';
import './AdminUsers.css';

export default function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleSave = () => {
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <div className="admin-users">
        <Card header={<h3>Nuevo Usuario</h3>}>
          <AdminUserForm
            user={selectedUser}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Card>

        <Card header={<h3>Lista de Usuarios</h3>}>
          <AdminUserList
            onEdit={handleEdit}
          />
        </Card>
      </div>
    </>
  );
}
