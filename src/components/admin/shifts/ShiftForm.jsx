import React, { useState } from 'react';
import { useShift } from '../../../context/ShiftContext';
import { format } from 'date-fns';

export default function ShiftForm({ onClose }) {
    const { createShift, selectedDate, loading, error } = useShift();
    const [slots, setSlots] = useState(['']);
    const [status, setStatus] = useState('active');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const shiftData = {
                date: format(selectedDate, 'yyyy-MM-dd'),
                slots: slots.filter(slot => slot.trim() !== ''),
                status
            };
            await createShift(shiftData);
            onClose();
        } catch (err) {
            console.error('Error creating shift:', err);
        }
    };

    const addSlot = () => {
        setSlots([...slots, '']);
    };

    const removeSlot = (index) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const updateSlot = (index, value) => {
        const newSlots = [...slots];
        newSlots[index] = value;
        setSlots(newSlots);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Create New Shift</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        disabled
                        className="border rounded p-2 w-full bg-gray-100"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Time Slots
                    </label>
                    {slots.map((slot, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <input
                                type="time"
                                value={slot}
                                onChange={(e) => updateSlot(index, e.target.value)}
                                className="border rounded p-2 flex-1"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeSlot(index)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSlot}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full mt-2"
                    >
                        Add Time Slot
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {error && (
                    <div className="mb-4 text-red-500">
                        Error: {error}
                    </div>
                )}

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Shift'}
                    </button>
                </div>
            </form>
        </div>
    );
}
