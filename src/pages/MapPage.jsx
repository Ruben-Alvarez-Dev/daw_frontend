import React, { useEffect } from 'react';
import { useMap } from '../context/MapContext';
import MapPreview from '../components/map/MapPreview';
import { GRID_SIZE } from '../components/map/constants';
import '../styles/MapPage.css';

const MapPage = () => {
    const {
        zones,
        selectedZone,
        selectedMap,
        loading,
        error,
        fetchZones,
        createMap,
        updateMap,
        selectZone,
        setSelectedMap
    } = useMap();

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    const handleAddElement = (element) => {
        if (!selectedMap) return;

        const updatedContent = {
            ...selectedMap.content,
            elements: [...((selectedMap.content?.elements) || []), element]
        };

        updateMap(selectedMap.id, { content: updatedContent });
    };

    const handleUpdateElement = (updatedElement) => {
        if (!selectedMap?.content?.elements) return;

        const updatedContent = {
            ...selectedMap.content,
            elements: selectedMap.content.elements.map(element => 
                element.id === updatedElement.id ? updatedElement : element
            )
        };

        updateMap(selectedMap.id, { content: updatedContent });
    };

    const handleDeleteElement = (elementId) => {
        if (!selectedMap?.content?.elements) return;

        const updatedContent = {
            ...selectedMap.content,
            elements: selectedMap.content.elements.filter(element => element.id !== elementId)
        };

        updateMap(selectedMap.id, { content: updatedContent });
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="map-page">
            <div className="map-page__sidebar">
                <h2>Zonas</h2>
                <ul className="map-page__zone-list">
                    {zones.map(zone => (
                        <li 
                            key={zone.id}
                            className={`map-page__zone-item ${selectedZone?.id === zone.id ? 'map-page__zone-item--selected' : ''}`}
                            onClick={() => selectZone(zone.id)}
                        >
                            {zone.name}
                        </li>
                    ))}
                </ul>

                {selectedZone && (
                    <>
                        <h3>Mapas de {selectedZone.name}</h3>
                        <ul className="map-page__map-list">
                            {selectedZone.maps?.map(map => (
                                <li 
                                    key={map.id}
                                    className={`map-page__map-item ${selectedMap?.id === map.id ? 'map-page__map-item--selected' : ''}`}
                                    onClick={() => setSelectedMap(map)}
                                >
                                    {map.name}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            <div className="map-page__editor">
                {selectedMap ? (
                    <MapPreview
                        mapData={selectedMap.content?.elements || []}
                        onAddElement={handleAddElement}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                    />
                ) : (
                    <div className="map-page__no-map">
                        <p>Selecciona una zona y un mapa para empezar a editar</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;
