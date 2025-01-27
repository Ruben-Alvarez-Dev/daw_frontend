import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Display from './components/layout/Display/Display';
import Footer from './components/layout/Footer/Footer';

export default function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <Display />
      <Footer />
    </div>
  );
}
