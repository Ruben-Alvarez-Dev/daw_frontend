import { BrowserRouter } from 'react-router-dom';
import AppProvider from './providers/AppProvider';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <AppRoutes />
            </AppProvider>
        </BrowserRouter>
    );
}

export default App;