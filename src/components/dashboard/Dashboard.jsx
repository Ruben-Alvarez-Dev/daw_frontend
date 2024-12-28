import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">
                Bienvenido, {user?.name}
            </h1>
            <div className="dashboard-content">
                <p>
                    Selecciona una opción del menú lateral para empezar.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
