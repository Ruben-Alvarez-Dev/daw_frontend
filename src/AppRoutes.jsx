import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Display from './components/display/Display';
import Footer from './components/layout/Footer/Footer';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import './AppRoutes.css';

export default function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Display />
        {isAuthRoute && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}
