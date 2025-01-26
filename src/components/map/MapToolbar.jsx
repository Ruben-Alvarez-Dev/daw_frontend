import React, { useState } from 'react';
import './MapToolbar.css';

export default function MapToolbar({ 
    mapName,
    onMapNameChange,
    onUndo,
    onRedo,
    onClear,
    onSave,
    canUndo,
    canRedo,
    maps,
    currentMapId,
    onMapSelect,
    onCreateZone,
    onDeactivateMap
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(mapName);
    const [showCreateZone, setShowCreateZone] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedName(mapName);
        }
    };

    const handleNameSubmit = () => {
        if (editedName.trim() !== '') {
            onMapNameChange(editedName);
            setIsEditing(false);
        }
    };

    const handleCreateZoneSubmit = () => {
        if (newZoneName.trim() !== '') {
            onCreateZone(newZoneName);
            setShowCreateZone(false);
            setNewZoneName('');
        }
    };

    return (
        <div className="map-toolbar">
            <div className="map-toolbar__left">
                <button 
                    className="map-toolbar__button" 
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    ↩ Deshacer
                </button>
                <button 
                    className="map-toolbar__button" 
                    onClick={onRedo}
                    disabled={!canRedo}
                >
                    ↪ Rehacer
                </button>
                <button 
                    className="map-toolbar__button" 
                    onClick={onClear}
                >
                    🗑 Limpiar
                </button>
                <button 
                    className="map-toolbar__button" 
                    onClick={onSave}
                >
                    💾 Guardar
                </button>
            </div>

            <div className="map-toolbar__center">
                <div className="map-toolbar__title-container">
                    {isEditing ? (
                        <input
                            type="text"
                            className="map-toolbar__name-input"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    ) : (
                        <>
                            <h2 
                                className="map-toolbar__title"
                                onClick={() => setIsEditing(true)}
                            >
                                {mapName}
                            </h2>
                            <button
                                className="map-toolbar__delete-button"
                                onClick={() => onDeactivateMap(currentMapId)}
                                title="Desactivar mapa"
                            >
                                🗑
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="map-toolbar__right">
                <select 
                    className="map-toolbar__select"
                    value={currentMapId}
                    onChange={(e) => onMapSelect(e.target.value)}
                >
                    {maps.map(map => (
                        <option key={map.id} value={map.id}>
                            {map.name}
                        </option>
                    ))}
                </select>

                {showCreateZone ? (
                    <div className="map-toolbar__zone-input">
                        <input
                            type="text"
                            placeholder="Nombre de la zona"
                            value={newZoneName}
                            onChange={(e) => setNewZoneName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateZoneSubmit()}
                        />
                        <button onClick={handleCreateZoneSubmit}>✓</button>
                        <button onClick={() => setShowCreateZone(false)}>✕</button>
                    </div>
                ) : (
                    <button 
                        className="map-toolbar__add-zone"
                        onClick={() => setShowCreateZone(true)}
                        title="Nueva zona"
                    >
                        +
                    </button>
                )}
            </div>
        </div>
    );
}
