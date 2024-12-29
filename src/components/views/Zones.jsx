import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';
import { Navigate } from 'react-router-dom';

const Zones = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Gestión de Zonas - Todos los restaurantes</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Gestión de Zonas - Restaurante {user.restaurantId}</h1>;
        default:
            return <Navigate to="/dashboard" replace />;
    }
};

export default Zones;
