import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/login/Login';
import Register from '../components/auth/register/Register';
import Dashboard from '../components/dashboard/Dashboard';
import Home from '../components/home/Home';
import PrivateRoute from './PrivateRoute';
import { useAuth } from '../context/AuthContext';
import RestaurantList from '../components/restaurants/restaurantList/RestaurantList';
import RestaurantForm from '../components/restaurants/restaurantForm/RestaurantForm';
import TableList from '../components/tables/tableList/TableList';
import TableForm from '../components/tables/tableForm/TableForm';
import UserList from '../components/users/userList/UserList';
import UserForm from '../components/users/userForm/UserForm';
import { ROLES } from '../constants/roles';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />

            {/* Rutas privadas */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Rutas de restaurantes */}
                <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurants/new" element={<RestaurantForm />} />
                <Route path="/restaurants/:id/edit" element={<RestaurantForm />} />
                
                {/* Rutas de mesas */}
                <Route path="/restaurants/:restaurantId/tables" element={<TableList />} />
                <Route path="/restaurants/:restaurantId/tables/new" element={<TableForm />} />
                <Route path="/restaurants/:restaurantId/tables/:id/edit" element={<TableForm />} />
                
                {/* Rutas de usuarios (solo admin) */}
                <Route 
                    path="/users" 
                    element={
                        user?.role === ROLES.ADMIN ? 
                        <UserList /> : 
                        <Navigate to="/dashboard" />
                    } 
                />
                <Route 
                    path="/users/new" 
                    element={
                        user?.role === ROLES.ADMIN ? 
                        <UserForm /> : 
                        <Navigate to="/dashboard" />
                    } 
                />
                <Route 
                    path="/users/:id/edit" 
                    element={
                        user?.role === ROLES.ADMIN ? 
                        <UserForm /> : 
                        <Navigate to="/dashboard" />
                    } 
                />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
