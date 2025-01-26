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
                // TODO: Cuando tengamos el backend, cargar desde ahí
                const initialMaps = [
                    { id: 1, name: 'Mapa Principal', zone: 'salon', active: true },
                    { id: 2, name: 'Terraza', zone: 'terrace', active: true }
                ];
                setMaps(initialMaps);
                if (initialMaps.length > 0) {
                    setCurrentMapId(initialMaps[0].id);
                    setMapName(initialMaps[0].name);
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
                // TODO: Cuando tengamos el backend, cargar desde ahí
                const map = maps.find(m => m.id === currentMapId);
                if (map) {
                    setMapName(map.name);
                    // Por ahora inicializamos con un array vacío
                    setElements([]);
                    setHistory([[]]);
                    setHistoryIndex(0);
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error al cargar elementos del mapa:', error);
                setIsLoading(false);
            }
        };
        loadMapElements();
    }, [currentMapId, maps]);

    const addElement = (element) => {
        if (!element) return;
        const newElements = [...elements, element];
        setElements(newElements);
        addToHistory(newElements);
    };

    const updateElement = (index, updatedElement) => {
        if (index < 0 || !updatedElement) return;
        const newElements = [...elements];
        newElements[index] = updatedElement;
        setElements(newElements);
        addToHistory(newElements);
    };

    const deleteElement = (index) => {
        if (index < 0) return;
        const newElements = elements.filter((_, i) => i !== index);
        setElements(newElements);
        addToHistory(newElements);
    };

    const addToHistory = (newElements) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push([...newElements]);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements(history[historyIndex - 1]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements(history[historyIndex + 1]);
        }
    };

    const handleMapNameChange = async (newName) => {
        // TODO: Actualizar nombre en el backend
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
        // TODO: Crear zona en el backend
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
        // TODO: Desactivar mapa en el backend
        const updatedMaps = maps.map(map => 
            map.id === mapId ? { ...map, active: false } : map
        );
        
        setMaps(updatedMaps);
        
        // Si el mapa actual fue desactivado, cambiar a otro mapa activo
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
        addToHistory(newElements);
    };

    const handleSave = async () => {
        // TODO: Guardar en el backend
        const mapData = {
            id: currentMapId,
            name: mapName,
            elements: elements
        };
        
        console.log('Guardando mapa:', mapData);
        // Aquí iría la llamada al backend
    };

    if (isLoading) {
        return <div className="map-editor">Cargando...</div>;
    }

    return (
        <div className="map-editor">
            <MapToolbar
                mapName={mapName}
                onMapNameChange={setMapName}
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
                        onAddElement={addElement}
                        onUpdateElement={updateElement}
                        onDeleteElement={deleteElement}
                    />
                </div>
            </div>
        </div>
    );
}
