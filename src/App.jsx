import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext/AuthContext'
import { AppProvider } from './contexts/AppContext/AppContext'
import SessionManager from './components/session/SessionManager/SessionManager'
import { useAuth } from './contexts/AuthContext/AuthContext'
import Navbar from './components/layout/Navbar/Navbar'
import Aside from './components/layout/Aside/Aside'
import Display from './components/layout/Display/Display'
import Home from './components/Home/Home'
import Footer from './components/layout/Footer/Footer'
import './App.css'

const AppContent = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        {isAuthenticated ? (
          <>
            <Aside />
            <Display />
          </>
        ) : (
          <Home />
        )}
      </main>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <SessionManager>
            <AppContent />
          </SessionManager>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App