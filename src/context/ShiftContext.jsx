import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

const ShiftContext = createContext();

export function ShiftProvider({ children }) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shifts, setShifts] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);
    const [distributions, setDistributions] = useState([]);
    const [history, setHistory] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    // Fetch shifts for a specific date
    const fetchShifts = useCallback(async (date = selectedDate) => {
        if (!token) return;
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const response = await fetch(`http://localhost:8000/api/shifts/date/${dateStr}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching shifts');
            const data = await response.json();
            setShifts(data.shifts);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, selectedDate]);

    // Create a new shift
    const createShift = useCallback(async (shiftData) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/shifts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(shiftData)
            });
            if (!response.ok) throw new Error('Error creating shift');
            const data = await response.json();
            setShifts(prev => [...prev, data.shift]);
            setError(null);
            return data.shift;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch distributions for a shift
    const fetchDistributions = useCallback(async (shiftId) => {
        if (!token || !shiftId) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/shifts/${shiftId}/distributions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching distributions');
            const data = await response.json();
            setDistributions(data.distributions);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Update distribution
    const updateDistribution = useCallback(async (shiftId, distributionId, distributionData) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/shifts/${shiftId}/distributions/${distributionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(distributionData)
            });
            if (!response.ok) throw new Error('Error updating distribution');
            const data = await response.json();
            setDistributions(prev => prev.map(dist => 
                dist.id === distributionId ? data.distribution : dist
            ));
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch history for a shift
    const fetchHistory = useCallback(async (shiftId) => {
        if (!token || !shiftId) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/shifts/${shiftId}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching history');
            const data = await response.json();
            setHistory(data.history);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Create history record
    const createHistoryRecord = useCallback(async (shiftId, historyData) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/shifts/${shiftId}/history`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historyData)
            });
            if (!response.ok) throw new Error('Error creating history record');
            const data = await response.json();
            setHistory(prev => [...prev, data.history]);
            setError(null);
            return data.history;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Update history record
    const updateHistoryRecord = useCallback(async (shiftId, historyId, historyData) => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/shifts/${shiftId}/history/${historyId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historyData)
            });
            if (!response.ok) throw new Error('Error updating history record');
            const data = await response.json();
            setHistory(prev => prev.map(record => 
                record.id === historyId ? data.history : record
            ));
            setError(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Fetch map templates
    const fetchTemplates = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/map-templates', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching templates');
            const data = await response.json();
            setTemplates(data.templates);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const value = {
        selectedDate,
        setSelectedDate,
        shifts,
        selectedShift,
        setSelectedShift,
        distributions,
        history,
        templates,
        loading,
        error,
        fetchShifts,
        createShift,
        fetchDistributions,
        updateDistribution,
        fetchHistory,
        createHistoryRecord,
        updateHistoryRecord,
        fetchTemplates
    };

    return (
        <ShiftContext.Provider value={value}>
            {children}
        </ShiftContext.Provider>
    );
}

export function useShift() {
    const context = useContext(ShiftContext);
    if (!context) {
        throw new Error('useShift must be used within a ShiftProvider');
    }
    return context;
}
