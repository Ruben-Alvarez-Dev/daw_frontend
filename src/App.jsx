// src/App.jsx
import './App.css'
import Navbar from './components/layout/Navbar/Navbar'
import Aside from './components/layout/Aside/Aside'
import Display from './components/layout/Display/Display'
import Footer from './components/layout/Footer/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Aside />
        <Display />
      </main>
      <Footer />
    </div>
  )
}

export default App