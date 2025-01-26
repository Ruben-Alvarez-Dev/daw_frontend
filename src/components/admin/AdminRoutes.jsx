import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import PrivateRoute from '../auth/PrivateRoute';
import { TablesProvider } from '../../context/TablesContext';
import { MapProvider } from '../../context/MapContext';
import MapPage from '../../pages/MapPage';

export default function AdminRoutes() {
  return (
    <TablesProvider>
      <MapProvider>
        <Routes>
          <Route path="/" element={
            <PrivateRoute requireAdmin={true}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/maps" element={
            <PrivateRoute requireAdmin={true}>
              <MapPage />
            </PrivateRoute>
          } />
        </Routes>
      </MapProvider>
    </TablesProvider>
  );
}
