import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const Reservations = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Gestión de Reservas - Todos los restaurantes</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Gestión de Reservas - Restaurante {user.restaurantId}</h1>;
        case ROLES.CUSTOMER:
            return <h1>Mis Reservas</h1>;
        default:
            return null;
    }
};

export default Reservations;
