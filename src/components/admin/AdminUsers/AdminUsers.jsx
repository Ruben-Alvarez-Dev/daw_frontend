import { useState } from 'react';
import AdminUserForm from './AdminUserForm';
import AdminUserList from './AdminUserList';
import Card from '../../common/Card/Card';
import './AdminUsers.css';

export default function AdminUsers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshList, setRefreshList] = useState(0);

    const handleSave = () => {
        setSelectedUser(null);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
    };

    const handleCancel = () => {
        setSelectedUser(null);
    };

    const handleDelete = (userId) => {
        setRefreshList(prev => prev + 1);
    };

    return (
        <div className="admin-users">
            <Card
                header="Nuevo Usuario"
                body={
                    <AdminUserForm
                        user={selectedUser}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                }
                footer={"Nuevo usuario"}
            />
            <Card
                header="Lista de Usuarios"
                body={
                    <AdminUserList
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        refresh={refreshList}
                    />
                }
                footer={"Lista de usuarios"}

            />
        </div>
    );
}
