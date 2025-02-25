import React, { useState } from 'react';
import Button from '../../common/Button/Button';
import './AdminDashboardShiftSelector.css';

export default function AdminDashboardShiftSelector({
    selectedDate,
    selectedShift,
    onDateChange,
    onShiftChange,
    shiftStats
}) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const handlePrevDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('es-ES', options);
    };

    const handleDateClick = () => {
        setIsDatePickerOpen(true);
        const input = document.getElementById('date-picker');
        if (input) {
            input.showPicker();
        }
    };

    const getShiftLabel = (shift) => {
        if (!shiftStats || !shiftStats[shift]) {
            return shift === 'lunch' ? 'Comida' : 'Cena';
        }
        const pax = shiftStats[shift]?.total_pax || 0;
        return `${shift === 'lunch' ? 'Comida' : 'Cena'} (${pax})`;
    };

    return (
        <div className="admin-dashboard-shift-selector">
            <Button 
                className="date-nav-button" 
                onClick={handlePrevDay}
                variant="secondary"
                label="<"
            />
            <div className="date-display" onClick={handleDateClick}>
                <span className="date-text">{formatDate(selectedDate)}</span>
                <input 
                    id="date-picker"
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => {
                        onDateChange(e.target.value);
                        setIsDatePickerOpen(false);
                    }}
                />
            </div>
            <Button 
                className="date-nav-button" 
                onClick={handleNextDay}
                variant="secondary"
                label=">"
            />
            <Button
                variant={selectedShift === 'lunch' ? 'primary' : 'secondary'}
                onClick={() => onShiftChange('lunch')}
                label={getShiftLabel('lunch')}
            />
            <Button
                variant={selectedShift === 'dinner' ? 'primary' : 'secondary'}
                onClick={() => onShiftChange('dinner')}
                label={getShiftLabel('dinner')}
            />
        </div>
    );
}
