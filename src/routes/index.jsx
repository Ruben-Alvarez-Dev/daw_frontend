import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';

// Auth components
import Login from '../components/auth/login/Login';
import Register from '../components/auth/register/Register';
import Home from '../components/home/Home';

// Views
import Dashboard from '../components/views/Dashboard';
import Users from '../components/views/Users';
import Restaurants from '../components/views/Restaurants';
import Tables from '../components/views/Tables';
import Zones from '../components/views/Zones';
import Reservations from '../components/views/Reservations';
import Profile from '../components/views/Profile';
import Settings from '../components/views/Settings';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/zones" element={<Zones />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
