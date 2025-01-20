import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigurationProvider } from './context/ConfigurationContext';
import { TablesProvider } from './context/TablesContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigurationProvider>
          <TablesProvider>
            <AppRoutes />
          </TablesProvider>
        </ConfigurationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;