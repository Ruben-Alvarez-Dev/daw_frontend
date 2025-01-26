import { useState } from 'react';
import './AdminAside.css';

export default function AdminAside({ activeSection, onSectionChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sections = [
    { id: 'users', icon: '👥', label: 'Usuarios' },
    { id: 'reservations', icon: '📅', label: 'Reservas' },
    { id: 'tables', icon: '🪑', label: 'Mesas' },
    { id: 'shifts', icon: '⏰', label: 'Turnos' },
    { id: 'maps', icon: '🗺️', label: 'Mapas' },
    { id: 'config', icon: '⚙️', label: 'Configuración' }
  ];

  return (
    <aside className={`admin-aside ${isExpanded ? 'admin-aside--expanded' : 'admin-aside--collapsed'}`}>
      <button 
        className="admin-aside__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '◀' : '▶'}
      </button>

      <nav className="admin-aside__nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`admin-aside__button ${
              activeSection === section.id ? 'admin-aside__button--active' : ''
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="admin-aside__icon">{section.icon}</span>
            {isExpanded && (
              <span className="admin-aside__label">{section.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
