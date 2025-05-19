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

    const response = await createAuthenticatedRequest(
        `${API_URL}/services`,
        'GET',
        token
    );

    const servicesArray = response.status === 200
        ? Object.keys(response)
            .filter(key => key !== 'status')
            .map(key => response[key])
        : [];

    return {
        success: response.status === 200,
        services: servicesArray
    };
};

