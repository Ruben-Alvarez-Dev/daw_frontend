import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const Restaurants = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Gestión de Restaurantes - Control Total</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Mi Restaurante - ID: {user.restaurantId}</h1>;
        case ROLES.CUSTOMER:
            return <h1>Listado de Restaurantes - Reservas</h1>;
        default:
            return null;
    }
};

export default Restaurants;
