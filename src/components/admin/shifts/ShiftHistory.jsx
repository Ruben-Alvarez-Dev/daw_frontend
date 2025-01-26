import React, { useEffect } from 'react';
import { useShift } from '../../../context/ShiftContext';
import { format } from 'date-fns';

export default function ShiftHistory({ shiftId }) {
    const {
        fetchHistory,
        createHistoryRecord,
        updateHistoryRecord,
        history,
        loading,
        error
    } = useShift();

    useEffect(() => {
        if (shiftId) {
            fetchHistory(shiftId);
        }
    }, [shiftId, fetchHistory]);

    const handleStatusChange = async (historyId, newStatus) => {
        try {
            await updateHistoryRecord(shiftId, historyId, {
                status: newStatus,
                ...(newStatus === 'seated' ? { actual_time: format(new Date(), 'HH:mm') } : {})
            });
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleAddNote = async (historyId, note) => {
        try {
            const record = history.find(h => h.id === historyId);
            if (!record) return;

            await updateHistoryRecord(shiftId, historyId, {
                notes: {
                    ...record.notes,
                    ...note
                }
            });
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    if (loading) return <div>Loading history...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Shift History</h2>

            <div className="grid gap-4">
                {history.map(record => (
                    <div
                        key={record.id}
                        className="border rounded-lg p-4"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">Table {record.table_id}</h3>
                                <p className="text-sm text-gray-600">
                                    Planned: {format(new Date(`2000-01-01T${record.planned_time}`), 'HH:mm')}
                                    {record.actual_time && ` | Actual: ${format(new Date(`2000-01-01T${record.actual_time}`), 'HH:mm')}`}
                                </p>
                            </div>
                            <select
                                value={record.status}
                                onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                className={`rounded px-2 py-1 text-sm ${
                                    record.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                                    record.status === 'seated' ? 'bg-green-100 text-green-800' :
                                    record.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    record.status === 'no_show' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}
                            >
                                <option value="planned">Planned</option>
                                <option value="seated">Seated</option>
                                <option value="completed">Completed</option>
                                <option value="no_show">No Show</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="mt-2">
                            <h4 className="text-sm font-medium mb-1">Notes</h4>
                            <div className="space-y-1">
                                {record.notes && Object.entries(record.notes).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                        <span className="font-medium">{key}:</span> {value}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    const note = prompt('Add note (key:value)');
                                    if (!note) return;
                                    const [key, value] = note.split(':');
                                    if (!key || !value) return;
                                    handleAddNote(record.id, { [key.trim()]: value.trim() });
                                }}
                                className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                            >
                                + Add Note
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
