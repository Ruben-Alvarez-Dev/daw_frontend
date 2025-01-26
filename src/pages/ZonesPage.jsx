import React, { useState, useEffect } from 'react';
import { useMap } from '../context/MapContext';
import MapPreview from '../components/map/MapPreview';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './ZonesPage.css';

const ZonesPage = () => {
    const {
        zones,
        selectedZone,
        selectedMap,
        loading,
        error,
        fetchZones,
        createZone,
        updateZone,
        deleteZone,
        selectZone,
        setSelectedMap
    } = useMap();

    const [isCreating, setIsCreating] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');
    const [editingZone, setEditingZone] = useState(null);

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    const handleCreateZone = (e) => {
        e.preventDefault();
        if (newZoneName.trim()) {
            createZone({ name: newZoneName.trim() });
            setNewZoneName('');
            setIsCreating(false);
        }
    };

    const handleUpdateZone = (e) => {
        e.preventDefault();
        if (editingZone && editingZone.name.trim()) {
            updateZone(editingZone.id, { name: editingZone.name.trim() });
            setEditingZone(null);
        }
    };

    const handleDeleteZone = (zoneId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta zona?')) {
            deleteZone(zoneId);
        }
    };

    if (loading) return <div className="zones-page__loading">Cargando...</div>;
    if (error) return <div className="zones-page__error">Error: {error}</div>;

    return (
        <div className="zones-page">
            <div className="zones-page__sidebar">
                <div className="zones-page__header">
                    <h2>Zonas</h2>
                    <button 
                        className="zones-page__add-btn"
                        onClick={() => setIsCreating(true)}
                    >
                        <FaPlus />
                    </button>
                </div>

                {isCreating && (
                    <form onSubmit={handleCreateZone} className="zones-page__form">
                        <input
                            type="text"
                            value={newZoneName}
                            onChange={(e) => setNewZoneName(e.target.value)}
                            placeholder="Nombre de la zona"
                            autoFocus
                        />
                        <div className="zones-page__form-actions">
                            <button type="submit">Guardar</button>
                            <button type="button" onClick={() => setIsCreating(false)}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                <ul className="zones-page__list">
                    {zones.map(zone => (
                        <li key={zone.id} className="zones-page__item">
                            {editingZone?.id === zone.id ? (
                                <form onSubmit={handleUpdateZone} className="zones-page__form">
                                    <input
                                        type="text"
                                        value={editingZone.name}
                                        onChange={(e) => setEditingZone({...editingZone, name: e.target.value})}
                                        autoFocus
                                    />
                                    <div className="zones-page__form-actions">
                                        <button type="submit">Guardar</button>
                                        <button type="button" onClick={() => setEditingZone(null)}>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="zones-page__zone-content">
                                    <span 
                                        className={`zones-page__zone-name ${selectedZone?.id === zone.id ? 'zones-page__zone-name--active' : ''}`}
                                        onClick={() => selectZone(zone.id)}
                                    >
                                        {zone.name}
                                    </span>
                                    <div className="zones-page__zone-actions">
                                        <button onClick={() => setEditingZone(zone)}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDeleteZone(zone.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedZone?.id === zone.id && (
                                <div className="zones-page__maps">
                                    <h4>Mapas</h4>
                                    <ul className="zones-page__maps-list">
                                        {zone.maps?.map(map => (
                                            <li 
                                                key={map.id}
                                                className={`zones-page__map-item ${selectedMap?.id === map.id ? 'zones-page__map-item--active' : ''}`}
                                                onClick={() => setSelectedMap(map)}
                                            >
                                                {map.name}
                                                {map.is_default && <span className="zones-page__default-badge">Por defecto</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="zones-page__content">
                {selectedMap ? (
                    <MapPreview
                        mapData={selectedMap.content?.elements || []}
                        onAddElement={handleAddElement}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                    />
                ) : (
                    <div className="zones-page__no-map">
                        <p>Selecciona una zona y un mapa para empezar a editar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZonesPage;
