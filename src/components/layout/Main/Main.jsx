import { useAuth } from '../../../context/AuthContext';
import AppRoutes from '../../../routes';
import './Main.css';

const Main = () => {
    const { user } = useAuth();

    return (
        <main className={`main ${!user ? 'main-full' : ''}`}>
            <div className="main-content">
                <AppRoutes />
            </div>
        </main>
    );
};

export default Main;
