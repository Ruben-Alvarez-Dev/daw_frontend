import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import AdminUserForm from './AdminUserForm';
import AdminUserList from './AdminUserList';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button'; // Added import for Button component
import './AdminUsers.css';

export default function AdminUsers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshList, setRefreshList] = useState(0);
    const [users, setUsers] = useState([]); // Added state for users
    const [filteredCount, setFilteredCount] = useState(0);
    const { token } = useAuth();

    const handleSave = () => {
        setSelectedUser(null);
        setIsEditing(false);
        setRefreshList(prev => prev + 1);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSelectedUser(null);
        setIsEditing(false);
    };

    const handleSelect = (user) => {
        if (user.id === selectedUser?.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
            setIsEditing(false);
        }
    };

    const handleDelete = async (user) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            setRefreshList(prev => prev + 1);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleFilteredCountChange = (count) => {
        setFilteredCount(count);
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
                header="Lista de Usuarios"
                body={
                    <AdminUserList
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        refresh={refreshList}
                        users={users} 
                        setUsers={setUsers} 
                        selectedUser={selectedUser}
                        onFilteredCountChange={handleFilteredCountChange}
                    />
                }
                footer={`Total: ${filteredCount} ${filteredCount === 1 ? 'usuario' : 'usuarios'}`}
            />
        </div>
    );
}
