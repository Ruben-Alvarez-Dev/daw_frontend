import api from './api';

export const mapService = {
    // Zone operations
    getZones: () => api.get('/zones'),
    getZone: (id) => api.get(`/zones/${id}`),
    createZone: (data) => api.post('/zones', data),
    updateZone: (id, data) => api.put(`/zones/${id}`, data),
    deleteZone: (id) => api.delete(`/zones/${id}`),

    // Map operations
    getMaps: () => api.get('/maps'),
    getMap: (id) => api.get(`/maps/${id}`),
    createMap: (data) => api.post('/maps', data),
    updateMap: (id, data) => api.put(`/maps/${id}`, data),
    deleteMap: (id) => api.delete(`/maps/${id}`),
    getMapHistory: (id) => api.get(`/maps/${id}/history`),

    // Shift zone operations
    getShiftZones: () => api.get('/shift-zones'),
    getShiftZone: (id) => api.get(`/shift-zones/${id}`),
    createShiftZone: (data) => api.post('/shift-zones', data),
    updateShiftZone: (id, data) => api.put(`/shift-zones/${id}`, data),
    deleteShiftZone: (id) => api.delete(`/shift-zones/${id}`),
    getShiftZoneTables: (id) => api.get(`/shift-zones/${id}/tables`),

    // Shift zone table operations
    createShiftZoneTable: (data) => api.post('/shift-zone-tables', data),
    updateShiftZoneTable: (id, data) => api.put(`/shift-zone-tables/${id}`, data),
    deleteShiftZoneTable: (id) => api.delete(`/shift-zone-tables/${id}`)
};
