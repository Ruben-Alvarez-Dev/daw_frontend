import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RestaurantConfigProvider } from './context/RestaurantConfigContext';
import { TablesProvider } from './context/TablesContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RestaurantConfigProvider>
          <TablesProvider>
            <AppRoutes />
          </TablesProvider>
        </RestaurantConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;