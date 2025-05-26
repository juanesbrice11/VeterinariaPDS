import { createAuthenticatedRequest } from "./ApiService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Service {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
}

export const getServices = async (token: string) => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/services`,
            'GET',
            token
        );

        if (response.status === 200) {
            return {
                success: true,
                services: Array.isArray(response.data) ? response.data : response.data.data || []
            };
        } else {
            return {
                success: false,
                message: response.message || 'Error al cargar los servicios'
            };
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        return {
            success: false,
            message: 'Error al cargar los servicios'
        };
    }
};

export const createService = async (
    serviceData: Omit<Service, 'id'>,
    token: string
): Promise<{
    success: boolean,
    message: string,
    service?: Service
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/services`,
            'POST',
            token,
            serviceData
        );

        return {
            success: response.status === 201,
            message: response.message,
            service: response.service
        };
    } catch (error) {
        console.error('Error creating service:', error);
        return {
            success: false,
            message: 'Error al crear el servicio'
        };
    }
};

export const updateService = async (
    serviceId: number,
    serviceData: Partial<Service>,
    token: string
): Promise<{
    success: boolean,
    message: string,
    service?: Service
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/services/${serviceId}`,
            'PUT',
            token,
            serviceData
        );

        return {
            success: response.status === 200,
            message: response.message,
            service: response.service
        };
    } catch (error) {
        console.error('Error updating service:', error);
        return {
            success: false,
            message: 'Error al actualizar el servicio'
        };
    }
};

export const deleteService = async (
    serviceId: number,
    token: string
): Promise<{
    success: boolean,
    message: string
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/services/admin/${serviceId}`,
            'DELETE',
            token
        );

        return {
            success: response.status === 200,
            message: response.message
        };
    } catch (error) {
        console.error('Error deleting service:', error);
        return {
            success: false,
            message: 'Error al eliminar el servicio'
        };
    }
}; 