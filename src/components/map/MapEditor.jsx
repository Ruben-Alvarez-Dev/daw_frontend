import React, { useState, useEffect } from 'react';
import MapPreview from './MapPreview';
import ArchitecturalTools from './ArchitecturalTools';
import MapToolbar from './MapToolbar';
import './MapEditor.css';

export default function MapEditor() {
    const [selectedTool, setSelectedTool] = useState('select');
    const [elements, setElements] = useState([]);
    const [history, setHistory] = useState([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [maps, setMaps] = useState([]);
    const [currentMapId, setCurrentMapId] = useState(null);
    const [mapName, setMapName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Cargar mapas al inicio
    useEffect(() => {
        const loadMaps = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/maps');
                const data = await response.json();
                setMaps(data);
                if (data.length > 0) {
                    setCurrentMapId(data[0].id);
                    setMapName(data[0].name);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error al cargar mapas:', error);
                setIsLoading(false);
            }
        };
        loadMaps();
    }, []);

    // Cargar elementos del mapa cuando cambie el currentMapId
    useEffect(() => {
        const loadMapElements = async () => {
            if (!currentMapId) return;
            
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8000/api/maps/${currentMapId}/elements`);
                const data = await response.json();
                setElements(data);
                setHistory([[...data]]);
                setHistoryIndex(0);
                setIsLoading(false);
            } catch (error) {
                console.error('Error al cargar elementos del mapa:', error);
                setIsLoading(false);
            }
        };
        loadMapElements();
    }, [currentMapId]);

    const handleAddElement = (newElement) => {
        const newElements = [...elements, newElement];
        setElements(newElements);
        
        // Actualizar historial
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newElements]);
        setHistory(newHistory);
        setHistoryIndex(historyIndex + 1);

        // Guardar en el backend
        saveMapElements(newElements);
    };

    const handleUpdateElement = (updatedElement) => {
        const newElements = elements.map(el => 
            el.id === updatedElement.id ? updatedElement : el
        );
        setElements(newElements);
        
        // Actualizar historial
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newElements]);
        setHistory(newHistory);
        setHistoryIndex(historyIndex + 1);

        // Guardar en el backend
        saveMapElements(newElements);
    };

    const handleDeleteElement = (elementId) => {
        const newElements = elements.filter(el => el.id !== elementId);
        setElements(newElements);
        
        // Actualizar historial
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newElements]);
        setHistory(newHistory);
        setHistoryIndex(historyIndex + 1);

        // Guardar en el backend
        saveMapElements(newElements);
    };

    const saveMapElements = async (elements) => {
        if (!currentMapId) return;

        try {
            await fetch(`http://localhost:8000/api/maps/${currentMapId}/elements`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(elements),
            });
        } catch (error) {
            console.error('Error al guardar elementos del mapa:', error);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements([...history[historyIndex - 1]]);
            saveMapElements(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements([...history[historyIndex + 1]]);
            saveMapElements(history[historyIndex + 1]);
        }
    };

    const handleMapNameChange = async (newName) => {
        const updatedMaps = maps.map(map => 
            map.id === currentMapId ? { ...map, name: newName } : map
        );
        setMaps(updatedMaps);
        setMapName(newName);
    };

    const handleMapSelect = (mapId) => {
        setCurrentMapId(Number(mapId));
    };

    const handleCreateZone = async (zoneName) => {
        const newId = Math.max(...maps.map(m => m.id)) + 1;
        const newMap = {
            id: newId,
            name: zoneName,
            zone: zoneName.toLowerCase().replace(/\s+/g, '_'),
            active: true
        };
        
        setMaps([...maps, newMap]);
        setCurrentMapId(newId);
    };

    const handleDeactivateMap = async (mapId) => {
        const updatedMaps = maps.map(map => 
            map.id === mapId ? { ...map, active: false } : map
        );
        
        setMaps(updatedMaps);
        
        if (mapId === currentMapId) {
            const nextActiveMap = updatedMaps.find(m => m.active && m.id !== mapId);
            if (nextActiveMap) {
                setCurrentMapId(nextActiveMap.id);
            }
        }
    };

    const handleClear = () => {
        const newElements = [];
        setElements(newElements);
        setHistory([newElements]);
        setHistoryIndex(0);
        saveMapElements(newElements);
    };

    const handleSave = async () => {
        const mapData = {
            id: currentMapId,
            name: mapName,
            elements: elements
        };
        
        console.log('Guardando mapa:', mapData);
    };

    if (isLoading) {
        return <div className="map-editor">Cargando...</div>;
    }

    return (
        <div className="map-editor">
            <MapToolbar
                mapName={mapName}
                onMapNameChange={handleMapNameChange}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClear={handleClear}
                onSave={handleSave}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                maps={maps}
                currentMapId={currentMapId}
                onMapSelect={handleMapSelect}
                onCreateZone={handleCreateZone}
                onDeactivateMap={handleDeactivateMap}
            />
            <div className="map-editor__content">
                <div className="map-editor__tools">
                    <ArchitecturalTools
                        selectedTool={selectedTool}
                        onToolSelect={setSelectedTool}
                    />
                </div>
                <div className="map-editor__canvas-container">
                    <MapPreview
                        elements={elements}
                        selectedTool={selectedTool}
                        onAddElement={handleAddElement}
                        onUpdateElement={handleUpdateElement}
                        onDeleteElement={handleDeleteElement}
                    />
                </div>
            </div>
        </div>
    );
}
