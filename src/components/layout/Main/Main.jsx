import { useAuth } from '../../../context/AuthContext';
import Aside from '../Aside/Aside';
import Display from '../Display/Display';
import AppRoutes from '../../../routes';
import './Main.css';

const Main = () => {
    const { user } = useAuth();

    return (
        <main className="main">
            {user ? (
                <>
                    <Aside />
                    <Display>
                        <AppRoutes />
                    </Display>
                </>
            ) : (
                <AppRoutes />
            )}
        </main>
    );
};

export default Main;
