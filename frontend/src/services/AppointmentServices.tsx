import { DetailedAppointment, Appointment, AvailableTimeSlotsResponse } from '@/types/schemas';
import { createAuthenticatedRequest } from './ApiService';

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export const createAppointment = async (token: string, appointment: Appointment): Promise<{
    success: boolean,
    message: string,
    data?: Appointment
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments`,
        'POST',
        token,
        appointment
    );

    return {
        success: response.status === 201,
        message: response.message,
        data: response.data
    };
};

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

export const getAvailableTimeSlots = async (date: string, token: string): Promise<AvailableTimeSlotsResponse> => {
    if (!token) {
        throw new Error("No active session");
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/available-slots?date=${date}`,
        'GET',
        token
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
};

export const cancelAppointment = async (token: string, appointmentId: number): Promise<{
    success: boolean,
    message: string,
    data?: Appointment
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/${appointmentId}/cancel`,
        'PATCH',
        token
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
}

export const getAllAppointments = async (token: string): Promise<{
    success: boolean,
    message: string,
    data?: DetailedAppointment[]
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/admin/all`,
        'GET',
        token
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
};

export const getAppointmentById = async (token: string, appointmentId: number): Promise<{
    success: boolean,
    message: string,
    data?: DetailedAppointment
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/admin/${appointmentId}`,
        'GET',
        token
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
};

export const updateAppointment = async (token: string, appointmentId: number, appointmentData: Partial<Appointment>): Promise<{
    success: boolean,
    message: string,
    data?: Appointment
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/admin/${appointmentId}`,
        'PUT',
        token,
        appointmentData
    );

    return {
        success: response.status === 200,
        message: response.message,
        data: response.data
    };
};

export const deleteAppointment = async (token: string, appointmentId: number): Promise<{
    success: boolean,
    message: string
}> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/appointments/admin/${appointmentId}`,
        'DELETE',
        token
    );

    return {
        success: response.status === 200,
        message: response.message
    };
};
