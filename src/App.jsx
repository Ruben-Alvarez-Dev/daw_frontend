import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConfigurationProvider } from './context/ConfigurationContext';
import { TableProvider } from './context/TableContext';
import { UserProvider } from './context/UserContext';
import AppRoutes from './AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConfigurationProvider>
          <TableProvider>
            <UserProvider>
              <AppRoutes />
            </UserProvider>
          </TableProvider>
        </ConfigurationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;