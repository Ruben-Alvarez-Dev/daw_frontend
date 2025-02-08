// Generate time options in 15-minute intervals for a given shift
export const generateTimeOptions = (shift) => {
    const lunchTimes = [];
    const dinnerTimes = [];
    
    // Generate times from 13:00 to 16:00 for lunch
    for (let hour = 13; hour <= 16; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            if (hour < 16 || (hour === 16 && minute === 0)) { // Include 16:00 but not beyond
                lunchTimes.push(time);
            }
        }
    }
    
    // Generate times from 20:00 to 23:30 for dinner
    for (let hour = 20; hour <= 23; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            if (hour < 23 || (hour === 23 && minute <= 30)) { // Only up to 23:30
                dinnerTimes.push(time);
            }
        }
    }
    
    return shift === 'lunch' ? lunchTimes : dinnerTimes;
};
