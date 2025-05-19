import { DetailedAppointment } from '@/types/schemas';
import { createAuthenticatedRequest } from './ApiService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSpecifiedAppointments = async (token: string): Promise<{
    success: boolean, 
    message: string,
    data?: DetailedAppointment[]
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/detailed`,
        'GET',
        token
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
};
