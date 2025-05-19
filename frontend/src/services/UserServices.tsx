import { UserProfile, UserResponse } from "@/types/schemas";
import { createAuthenticatedRequest } from "./ApiService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getActualUser = async (token: string): Promise<UserResponse | { error: string }> => {
    if (!token) {
        return { error: "No active session" };
    }

    return await createAuthenticatedRequest(
        `${API_URL}/users/me`,
        'GET',
        token
    );
};

export const updateUser = async (
    userData: UserProfile, 
    token: string
): Promise<{ success: boolean, message: string, user?: any }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/users/me`,
        'PUT',
        token,
        userData
    );

    return {
        success: response.status === 200,
        message: response.message,
        user: response.user
    };
};

export const updatePassword = async (
    currentPassword: string,
    newPassword: string,
    token: string
): Promise<{ success: boolean, message: string }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/users/me/password`,
        'PATCH',
        token,
        { currentPassword, newPassword }
    );

    return {
        success: response.status === 200,
        message: response.message
    };
};