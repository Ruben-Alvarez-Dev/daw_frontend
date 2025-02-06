import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigurationProvider } from './context/ConfigurationContext';
import { DashboardProvider } from './context/DashboardContext';
import { ShiftsProvider } from './context/ShiftsContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ConfigurationProvider>
                    <DashboardProvider>
                        <ShiftsProvider>
                            <AppRoutes />
                        </ShiftsProvider>
                    </DashboardProvider>
                </ConfigurationProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;