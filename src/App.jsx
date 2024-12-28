import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar/Navbar';
import Main from './components/layout/Main/Main';
import Footer from './components/layout/Footer/Footer';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppProvider>
                    <div className="app">
                        <Navbar />
                        <Main />
                        <Footer />
                    </div>
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;