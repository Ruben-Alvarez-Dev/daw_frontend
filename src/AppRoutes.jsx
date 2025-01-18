import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Display from './components/layout/Display';
import Footer from './components/layout/Footer';

export default function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <Display />
      <Footer />
    </div>
  );
}
