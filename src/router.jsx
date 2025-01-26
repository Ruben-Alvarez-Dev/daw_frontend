import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import ZonesPage from './pages/ZonesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ReservationsPage from './pages/ReservationsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTablesPage from './pages/AdminTablesPage';
import AdminShiftsPage from './pages/AdminShiftsPage';
import { PrivateRoute, AdminRoute } from './components/auth/ProtectedRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        path: '/reservations',
        element: <PrivateRoute><ReservationsPage /></PrivateRoute>,
    },
    {
        path: '/admin',
        element: <AdminRoute><AdminLayout /></AdminRoute>,
        children: [
            {
                path: 'zones',
                element: <ZonesPage />,
            },
            {
                path: 'tables',
                element: <AdminTablesPage />,
            },
            {
                path: 'shifts',
                element: <AdminShiftsPage />,
            },
            {
                path: 'users',
                element: <AdminUsersPage />,
            },
        ],
    },
]);

export default router;
