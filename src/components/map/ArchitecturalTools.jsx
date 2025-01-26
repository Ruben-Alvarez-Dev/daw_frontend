import React from 'react';
import './ArchitecturalTools.css';

const TOOLS = [
    {
        id: 'select',
        name: 'Seleccionar',
        icon: '↖'
    },
    {
        id: 'wall',
        name: 'Muro',
        icon: '▭'
    },
    {
        id: 'door',
        name: 'Puerta',
        icon: '⌓'
    },
    {
        id: 'window',
        name: 'Ventana',
        icon: '⊡'
    },
    {
        id: 'column',
        name: 'Columna',
        icon: '◯'
    },
    {
        id: 'furniture',
        name: 'Mueble',
        icon: '🪑'
    },
    {
        id: 'vegetation',
        name: 'Vegetación',
        icon: '🌿'
    },
    {
        id: 'surface',
        name: 'Superficie',
        icon: '◱'
    }
];

export default function ArchitecturalTools({ selectedTool, onToolSelect }) {
    return (
        <div className="architectural-tools">
            <h3 className="architectural-tools__title">Elementos Arquitectónicos</h3>
            
            <div className="architectural-tools__list">
                {TOOLS.map(tool => (
                    <button
                        key={tool.id}
                        className={`architectural-tools__item ${selectedTool === tool.id ? 'architectural-tools__item--selected' : ''}`}
                        onClick={() => onToolSelect(tool.id)}
                    >
                        <span className="architectural-tools__icon">{tool.icon}</span>
                        <span className="architectural-tools__name">{tool.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
