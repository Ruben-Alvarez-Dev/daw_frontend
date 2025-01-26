import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import PrivateRoute from '../auth/PrivateRoute';
import { TablesProvider } from '../../context/TablesContext';

export default function AdminRoutes() {
  return (
    <TablesProvider>
      <PrivateRoute requireAdmin={true}>
        <AdminDashboard />
      </PrivateRoute>
    </TablesProvider>
  );
}
