import UserList from '../components/Users/UserList/UserList';
import UserForm from '../components/Users/UserForm/UserForm';
import Display from '../components/layout/Display/Display';

const Users = () => {
    return (
        <Display>
            <div className="view-container">
                <UserList id="userList" />
                <UserForm id="userForm" />
            </div>
        </Display>
    );
};

export default Users;
