import { useAuth } from '../../context/AuthContext';
import AdminDisplay from './AdminDisplay';
import CustomerDisplay from './CustomerDisplay';
import Loading from '../common/Loading/Loading';

export default function Display() {
    const { user, loading, isAdmin, isCustomer } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return (
            <div className="welcome-container">
                <h1>Bienvenido a RestaurantApp</h1>
                <p>Descubre una experiencia culinaria única en el corazón de la ciudad.</p>
                <p>Nuestro restaurante combina la tradición de la cocina local con toques modernos e innovadores, creando platos que deleitarán todos tus sentidos.</p>
            </div>
        );
    }

    if (isAdmin()) {
        return <AdminDisplay />;
    }

    if (isCustomer()) {
        return <CustomerDisplay />;
    }

    // Si el usuario tiene un rol no reconocido
    return (
        <div className="error-container">
            <h1>Error de Acceso</h1>
            <p>No tienes un rol válido asignado. Por favor, contacta con el administrador.</p>
        </div>
    );
}
