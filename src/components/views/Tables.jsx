import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { Navigate } from 'react-router-dom';

const Tables = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Gestión de Mesas - Todos los restaurantes</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Gestión de Mesas - Restaurante {user.restaurantId}</h1>;
        default:
            return <Navigate to="/dashboard" replace />;
    }
};

export default Tables;
