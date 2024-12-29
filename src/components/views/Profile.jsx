import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    return <h1>Perfil de Usuario - {user.email}</h1>;
};

export default Profile;
