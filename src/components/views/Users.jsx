import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ROLES } from '../../constants/roles';
import { Navigate } from 'react-router-dom';
import UserList from '../Users/UserList/UserList';
import UserForm from '../Users/UserForm/UserForm';

const Users = () => {
    const { user } = useAuth();
    const { setActiveUser, clearActiveUser } = useApp();
    const [activeCardId, setActiveCardId] = useState('userList');
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    if (user.role !== ROLES.ADMIN) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setActiveUser(user);
    };

    const handleUserUpdate = () => {
        setRefreshCounter(prev => prev + 1);
        setSelectedUser(null);
        clearActiveUser();
        setActiveCardId('userList');
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        clearActiveUser();
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
