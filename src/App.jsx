import { AuthProvider, useAuth } from './context/AuthContext/AuthContext'
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
      {isAuthenticated ? (
        <main className="main">
          <Aside />
          <Display />
        </main>
      ) : (
        <Home />
      )}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App