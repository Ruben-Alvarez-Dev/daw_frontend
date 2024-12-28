import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar/Navbar';
import Aside from './Aside/Aside';
import Display from './Display/Display';
import Footer from './Footer/Footer';
import './Layout.css';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="layout">
            <Navbar />
            <div className="layout-content">
                {user && <Aside />}
                <Display>{children}</Display>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
