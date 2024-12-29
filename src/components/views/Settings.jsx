import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const Settings = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Configuración Global</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Configuración - Restaurante {user.restaurantId}</h1>;
        case ROLES.CUSTOMER:
            return <h1>Preferencias de Usuario</h1>;
        default:
            return null;
    }
};

export default Settings;
