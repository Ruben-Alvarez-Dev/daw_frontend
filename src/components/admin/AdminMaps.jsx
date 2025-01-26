import React from 'react';
import MapEditor from '../map/MapEditor';
import { MapProvider } from '../../context/MapContext';

export default function AdminMaps() {
    return (
        <div className="admin-page">
            <h1 className="admin-page__title">Gestión del Mapa</h1>
            
            <MapProvider>
                <MapEditor />
            </MapProvider>
        </div>
    );
}
