import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/roles';

const Dashboard = () => {
    const { user } = useAuth();

    switch (user.role) {
        case ROLES.ADMIN:
            return <h1>Dashboard Admin - Estadísticas Globales</h1>;
        case ROLES.SUPERVISOR:
            return <h1>Dashboard Supervisor - Estadísticas de Restaurante {user.restaurantId}</h1>;
        case ROLES.CUSTOMER:
            return <h1>Dashboard Cliente - Mis Reservas</h1>;
        default:
            return null;
    }
};

export default Dashboard;
