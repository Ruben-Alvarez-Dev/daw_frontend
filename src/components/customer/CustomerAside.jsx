import { useState } from 'react';
import './CustomerAside.css';

export default function CustomerAside({ activeSection, onSectionChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const sections = [
    { id: 'profile', icon: '👤', label: 'Perfil' },
    { id: 'reservations', icon: '📅', label: 'Reservas' }
  ];

  return (
    <aside className={`customer-aside ${isExpanded ? 'customer-aside--expanded' : 'customer-aside--collapsed'}`}>
      <button 
        className="customer-aside__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '◀' : '▶'}
      </button>

      <nav className="customer-aside__nav">
        {sections.map(section => (
          <button
            key={section.id}
            className={`customer-aside__button ${
              activeSection === section.id ? 'customer-aside__button--active' : ''
            }`}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="customer-aside__icon">{section.icon}</span>
            {isExpanded && (
              <span className="customer-aside__label">{section.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}
