export const deleteService = async (id: number, token: string): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/services/admin/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return {
            success: response.ok,
            message: data.message
        };
    } catch (error) {
        console.error('Error deleting service:', error);
        return {
            success: false,
            message: 'Error al eliminar el servicio'
        };
    }
}; 