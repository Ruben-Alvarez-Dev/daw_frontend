export const configurationFields = [
    {
        name: 'timeEstimateSmall',
        type: 'number',
        label: 'Tiempo estimado mesa pequeña (min)',
        placeholder: 'Tiempo en minutos',
        required: true
    },
    {
        name: 'timeEstimateLarge',
        type: 'number',
        label: 'Tiempo estimado mesa grande (min)',
        placeholder: 'Tiempo en minutos',
        required: true
    },
    {
        name: 'timeInterval',
        type: 'number',
        label: 'Intervalo entre reservas (min)',
        placeholder: 'Tiempo en minutos',
        required: true
    },
    {
        name: 'simultaneousTables',
        type: 'number',
        label: 'Mesas simultáneas máximas',
        placeholder: 'Número de mesas',
        required: true
    },
    {
        name: 'openingHours.afternoon.open',
        type: 'time',
        label: 'Apertura mediodía',
        required: true
    },
    {
        name: 'openingHours.afternoon.close',
        type: 'time',
        label: 'Cierre mediodía',
        required: true
    },
    {
        name: 'openingHours.evening.open',
        type: 'time',
        label: 'Apertura noche',
        required: true
    },
    {
        name: 'openingHours.evening.close',
        type: 'time',
        label: 'Cierre noche',
        required: true
    }
];
