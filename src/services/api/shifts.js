const API_URL = import.meta.env.VITE_API_URL;

export async function getShiftConfiguration(date, type, token) {
    try {
        const response = await fetch(`${API_URL}/api/shifts/configuration/${date}/${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch shift configuration');
        }

        const data = await response.json();
        return {
            tables: data.tables || []
        };
    } catch (error) {
        console.error('Error fetching shift configuration:', error);
        throw error;
    }
}

export async function saveShiftConfiguration(date, type, configuration, token) {
    try {
        const response = await fetch(`${API_URL}/api/shifts/configuration/${date}/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ tables: configuration })
        });

        if (!response.ok) {
            throw new Error('Failed to save shift configuration');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving shift configuration:', error);
        throw error;
    }
}
