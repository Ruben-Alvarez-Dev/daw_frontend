import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigurationProvider } from './context/ConfigurationContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ConfigurationProvider>
                    <AppRoutes />
                </ConfigurationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;