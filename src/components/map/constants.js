export const GRID_SIZE = 20;

export const ELEMENT_TYPES = {
    WALL: 'wall',
    WINDOW: 'window',
    COLUMN: 'column',
    VEGETATION: 'vegetation',
    SURFACE: 'surface'
};

export const TEXTURES = {
    [ELEMENT_TYPES.WALL]: { 
        fill: '#8B7355', 
        stroke: '#000000' 
    },
    [ELEMENT_TYPES.WINDOW]: { 
        fill: '#87CEEB', 
        stroke: '#4682B4' 
    },
    [ELEMENT_TYPES.COLUMN]: { 
        fill: '#A0522D', 
        stroke: '#8B4513' 
    },
    [ELEMENT_TYPES.VEGETATION]: { 
        fill: '#228B22', 
        stroke: '#006400' 
    },
    [ELEMENT_TYPES.SURFACE]: { 
        fill: '#D3D3D3', 
        stroke: '#A9A9A9' 
    }
};

export const PERIODS = {
    AFTERNOON: 'afternoon',
    EVENING: 'evening'
};

export const TABLE_STATUS = {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    RESERVED: 'reserved'
};

export const RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    SEATED: 'seated',
    NO_SHOW: 'no-show'
};
