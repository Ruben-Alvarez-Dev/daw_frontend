import React, { useEffect } from 'react';
import { useShift } from '../../../context/ShiftContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ShiftList() {
    const {
        selectedDate,
        setSelectedDate,
        shifts,
        selectedShift,
        setSelectedShift,
        loading,
        error,
        fetchShifts
    } = useShift();

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts, selectedDate]);

    if (loading) return <div>Cargando turnos...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Turnos del día</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        className="border rounded p-2"
                    />
                    <button
                        onClick={() => setSelectedDate(new Date())}
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                        Hoy
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shifts.map(shift => (
                    <div
                        key={shift.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedShift?.id === shift.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedShift(shift)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">
                                    {format(new Date(shift.date), 'EEEE d MMMM', { locale: es })}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {shift.slots.join(', ')}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${
                                shift.status === 'active' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {shift.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Aquí irá la navegación a la distribución
                                }}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Distribución
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Aquí irá la navegación al historial
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                                Historial
                            </button>
                        </div>
                    </div>
                ))}

                <div
                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-300 cursor-pointer flex items-center justify-center min-h-[200px] transition-colors"
                    onClick={() => {
                        // Aquí irá la lógica para crear nuevo turno
                    }}
                >
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl text-gray-500">+</span>
                        </div>
                        <p className="text-gray-500">Crear nuevo turno</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
