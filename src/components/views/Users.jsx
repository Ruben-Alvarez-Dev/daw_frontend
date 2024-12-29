import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { Navigate } from 'react-router-dom';
import UserList from '../Users/UserList/UserList';
import UserForm from '../Users/UserForm/UserForm';

const Users = () => {
    const { user } = useAuth();
    const [activeCardId, setActiveCardId] = useState('userList');
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    if (user.role !== ROLES.ADMIN) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        if (user) {
            setActiveCardId('userForm');
        }
    };

    const handleUserUpdate = () => {
        setRefreshCounter(prev => prev + 1); // Forzar actualización de la lista
        setSelectedUser(null); // Limpiar usuario seleccionado
        setActiveCardId('userList'); // Volver a la lista
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setActiveCardId('userForm');
    };

    return (
        <div style={{ display: 'flex', height: '100%', padding: '1rem' }}>
            <UserList 
                id="userList"
                isActive={activeCardId === 'userList'}
                onActivate={setActiveCardId}
                onSelectUser={handleUserSelect}
                refreshTrigger={refreshCounter}
                onAddUser={handleAddUser}
            />
            <UserForm 
                id="userForm"
                isActive={activeCardId === 'userForm'}
                onActivate={setActiveCardId}
                selectedUser={selectedUser}
                onUpdate={handleUserUpdate}
            />
        </div>
    );
};

export default Users;
