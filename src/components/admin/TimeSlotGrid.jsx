import { useState, useEffect } from 'react';
import { useConfiguration } from '../../context/ConfigurationContext';
import './TimeSlotGrid.css';

const TimeSlotGrid = ({ onSelectTimeSlot, selectedTime, reservations = [] }) => {
  const { config, loading: configLoading } = useConfiguration();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    console.log('TimeSlotGrid - Config:', config);
    console.log('TimeSlotGrid - Reservations:', reservations);
    
    if (config?.openingHours && !configLoading) {
      generateAllTimeSlots();
    }
  }, [config, reservations, configLoading]);

  const getReservationsForTime = (timeStr) => {
    return reservations.filter(res => res.time === timeStr).length;
  };

  const generateAllTimeSlots = () => {
    if (!config?.openingHours || !config?.simultaneousTables) {
      console.log('Missing required config:', config);
      return;
    }

    console.log('Generating slots with config:', config);
    const allSlots = [];
    const periods = ['afternoon', 'evening'];

    periods.forEach(period => {
      if (!config.openingHours[period]?.open || !config.openingHours[period]?.close) {
        console.log(`Invalid opening hours for ${period}:`, config.openingHours[period]);
        return;
      }

      const { open, close } = config.openingHours[period];
      console.log(`Processing ${period} period: ${open} - ${close}`);
      
      try {
        let currentTime = new Date(`2000-01-01T${open}`);
        const endTime = new Date(`2000-01-01T${close}`);

        while (currentTime < endTime) {
          const hour = currentTime.getHours();
          const minutes = currentTime.getMinutes();
          const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          const reservedCount = getReservationsForTime(timeString);
          const availableSlots = Math.max(0, config.simultaneousTables - reservedCount);

          allSlots.push({
            time: timeString,
            period,
            hour,
            availableSlots,
            totalSlots: config.simultaneousTables
          });

          currentTime.setMinutes(currentTime.getMinutes() + (config.timeInterval || 15));
        }
      } catch (error) {
        console.error(`Error processing ${period} period:`, error);
      }
    });

    console.log('Generated slots:', allSlots);

    if (allSlots.length === 0) {
      console.log('No slots were generated');
      return;
    }

    // Agrupar por periodo y hora
    const groupedSlots = allSlots.reduce((acc, slot) => {
      if (!acc[slot.period]) {
        acc[slot.period] = {};
      }
      if (!acc[slot.period][slot.hour]) {
        acc[slot.period][slot.hour] = [];
      }
      acc[slot.period][slot.hour].push(slot);
      return acc;
    }, {});

    console.log('Grouped slots:', groupedSlots);
    setSlots(groupedSlots);
  };

  const getAvailabilityClass = (availableSlots, totalSlots) => {
    if (availableSlots === 0) return 'disabled';
    if (availableSlots === 1) return 'low';
    const ratio = availableSlots / totalSlots;
    if (ratio === 1) return 'full';
    if (ratio >= 0.7) return 'high';
    return 'medium';
  };

  const TimeSlotCard = ({ slot, isSelected }) => {
    const availabilityClass = getAvailabilityClass(slot.availableSlots, slot.totalSlots);
    
    return (
      <div
        className={`timeslot-card ${availabilityClass} ${isSelected ? 'selected' : ''}`}
        onClick={() => slot.availableSlots > 0 && onSelectTimeSlot?.(slot.time)}
      >
        {slot.time} ({slot.availableSlots})
      </div>
    );
  };

  const renderHourRow = (hourSlots) => {
    return (
      <div className="interval-row">
        {hourSlots.map((slot, idx) => (
          <TimeSlotCard
            key={`${slot.time}-${idx}`}
            slot={slot}
            isSelected={selectedTime === slot.time}
          />
        ))}
      </div>
    );
  };

  if (configLoading) {
    return (
      <div className="timeslot-container">
        <p className="text-gray-400">Cargando configuración del restaurante...</p>
      </div>
    );
  }

  if (!config?.openingHours) {
    return (
      <div className="timeslot-container">
        <p className="text-gray-400">Error: No se pudo cargar la configuración del restaurante</p>
      </div>
    );
  }

  return (
    <div className="timeslot-container">
      {['afternoon', 'evening'].map(period => (
        slots[period] && Object.keys(slots[period]).length > 0 && (
          <div key={period}>
            <h3 className="period-title">
              {period === 'afternoon' ? 'Horario de Tarde' : 'Horario de Noche'}
            </h3>
            <div className="timeslots-grid">
              {Object.entries(slots[period]).map(([hour, hourSlots]) => (
                <div key={`${period}-${hour}`}>
                  {renderHourRow(hourSlots)}
                </div>
              ))}
            </div>
          </div>
        )
      ))}
      {(!slots.afternoon || !slots.evening || 
        (Object.keys(slots.afternoon || {}).length === 0 && Object.keys(slots.evening || {}).length === 0)) && (
        <p className="text-gray-400 text-center py-4">
          No hay horarios disponibles para mostrar
        </p>
      )}
    </div>
  );
};

export default TimeSlotGrid;
