/**
 * Restaurant shift types
 * These values are hardcoded and should not be changed
 * They are used consistently across the entire application
 */
export const SHIFTS = {
    LUNCH: 'lunch',
    DINNER: 'dinner'
};

/**
 * Get all available shift types
 * @returns {string[]} Array of shift types
 */
export const getShiftTypes = () => [SHIFTS.LUNCH, SHIFTS.DINNER];

/**
 * Check if a given value is a valid shift type
 * @param {string} shift - The shift value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidShift = (shift) => Object.values(SHIFTS).includes(shift);

/**
 * Default shift for new reservations
 */
export const DEFAULT_SHIFT = SHIFTS.LUNCH;
