import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { mapService } from '../services/mapService';

const MapContext = createContext();

export function MapProvider({ children }) {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedMap, setSelectedMap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all zones
    const fetchZones = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await mapService.getZones();
            setZones(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new zone
    const createZone = useCallback(async (zoneData) => {
        try {
            const { data } = await mapService.createZone(zoneData);
            setZones(prev => [...prev, data]);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Update zone
    const updateZone = useCallback(async (zoneId, zoneData) => {
        try {
            const { data } = await mapService.updateZone(zoneId, zoneData);
            setZones(prev => prev.map(z => z.id === zoneId ? data : z));
            if (selectedZone?.id === zoneId) {
                setSelectedZone(data);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [selectedZone]);

    // Delete zone
    const deleteZone = useCallback(async (zoneId) => {
        try {
            await mapService.deleteZone(zoneId);
            setZones(prev => prev.filter(z => z.id !== zoneId));
            if (selectedZone?.id === zoneId) {
                setSelectedZone(null);
                setSelectedMap(null);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [selectedZone]);

    // Create new map
    const createMap = useCallback(async (mapData) => {
        try {
            const { data } = await mapService.createMap(mapData);
            if (selectedZone?.id === data.zone_id) {
                setSelectedZone(prev => ({
                    ...prev,
                    maps: [...(prev.maps || []), data]
                }));
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [selectedZone]);

    // Update map
    const updateMap = useCallback(async (mapId, mapData) => {
        try {
            const { data } = await mapService.updateMap(mapId, mapData);
            if (selectedZone?.id === data.zone_id) {
                setSelectedZone(prev => ({
                    ...prev,
                    maps: prev.maps.map(m => m.id === mapId ? data : m)
                }));
            }
            if (selectedMap?.id === mapId) {
                setSelectedMap(data);
            }
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [selectedZone, selectedMap]);

    // Delete map
    const deleteMap = useCallback(async (mapId) => {
        try {
            await mapService.deleteMap(mapId);
            if (selectedZone) {
                setSelectedZone(prev => ({
                    ...prev,
                    maps: prev.maps.filter(m => m.id !== mapId)
                }));
            }
            if (selectedMap?.id === mapId) {
                setSelectedMap(null);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, [selectedZone, selectedMap]);

    // Get map history
    const getMapHistory = useCallback(async (mapId) => {
        try {
            const { data } = await mapService.getMapHistory(mapId);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Select zone and load its maps
    const selectZone = useCallback(async (zoneId) => {
        try {
            const { data } = await mapService.getZone(zoneId);
            setSelectedZone(data);
            setSelectedMap(data.default_map);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const value = {
        zones,
        selectedZone,
        selectedMap,
        loading,
        error,
        fetchZones,
        createZone,
        updateZone,
        deleteZone,
        createMap,
        updateMap,
        deleteMap,
        getMapHistory,
        selectZone,
        setSelectedMap
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}

export function useMap() {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMap must be used within a MapProvider');
    }
    return context;
}
