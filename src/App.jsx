import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppProvider>
                    <Layout>
                        <AppRoutes />
                    </Layout>
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;