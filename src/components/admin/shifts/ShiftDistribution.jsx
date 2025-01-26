import React, { useEffect, useState } from 'react';
import { useShift } from '../../../context/ShiftContext';

export default function ShiftDistribution({ shiftId }) {
    const {
        fetchDistributions,
        updateDistribution,
        fetchTemplates,
        distributions,
        templates,
        loading,
        error
    } = useShift();

    const [selectedZone, setSelectedZone] = useState('salon');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [tablePositions, setTablePositions] = useState({});

    useEffect(() => {
        if (shiftId) {
            fetchDistributions(shiftId);
            fetchTemplates();
        }
    }, [shiftId, fetchDistributions, fetchTemplates]);

    useEffect(() => {
        if (distributions.length > 0) {
            const currentDistribution = distributions.find(d => d.zone === selectedZone);
            if (currentDistribution) {
                setTablePositions(currentDistribution.table_positions);
                setSelectedTemplate(currentDistribution.map_template_id);
            }
        }
    }, [distributions, selectedZone]);

    const handleTableDrag = (tableId, position) => {
        setTablePositions(prev => ({
            ...prev,
            [tableId]: position
        }));
    };

    const handleSaveDistribution = async () => {
        if (!selectedTemplate) return;

        const distributionId = distributions.find(d => d.zone === selectedZone)?.id;
        if (!distributionId) return;

        try {
            await updateDistribution(shiftId, distributionId, {
                map_template_id: selectedTemplate,
                table_positions: tablePositions
            });
        } catch (err) {
            console.error('Error saving distribution:', err);
        }
    };

    if (loading) return <div>Loading distribution...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Shift Distribution</h2>
                <div className="flex gap-4">
                    <select
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="salon">Salon</option>
                        <option value="terrace">Terrace</option>
                    </select>
                    <select
                        value={selectedTemplate || ''}
                        onChange={(e) => setSelectedTemplate(Number(e.target.value))}
                        className="border rounded p-2"
                    >
                        <option value="">Select Template</option>
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="border rounded-lg p-4 mb-4 min-h-[400px] relative">
                {/* Aquí irá el componente de arrastrar y soltar mesas */}
                <div className="absolute inset-0 bg-gray-50">
                    {Object.entries(tablePositions).map(([tableId, position]) => (
                        <div
                            key={tableId}
                            className="absolute bg-white border rounded p-2 cursor-move"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                            draggable
                            onDragEnd={(e) => {
                                const rect = e.currentTarget.parentElement.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                handleTableDrag(tableId, { x, y });
                            }}
                        >
                            Table {tableId}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveDistribution}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={!selectedTemplate}
                >
                    Save Distribution
                </button>
            </div>
        </div>
    );
}
