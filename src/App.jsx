import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;