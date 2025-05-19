import { Service } from "@/types/schemas";
import { createAuthenticatedRequest } from "./ApiService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getServices = async (token: string): Promise<{
    success: boolean, 
    message?: string,
    services?: Service[]
}> => {
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
                services: response.data
            };
        } else {
            return {
                success: false,
                message: response.message || 'Error fetching services'
            };
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        return {
            success: false,
            message: 'Error fetching services'
        };
    }
};

