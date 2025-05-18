import { UserProfile, UserResponse } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAuthenticatedRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    token: string,
    body?: object
) => {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

    const requestOptions: RequestInit = {
        method,
        headers
    };

    if (body) {
        requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return { error: "Authentication error: Your session has expired" };
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error parsing JSON response:", error);
        return { error: "Error processing response" };
    }
};

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

export const updateUser = async (userData: UserProfile, token: string): Promise<{ success?: boolean, error?: string }> => {
    if (!token) {
        return { error: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/users/me`,
        'PUT',
        token,
        userData
    );

    if (response.error) {
        return { error: response.error || "Error updating user" };
    }

    return { success: true };
};

export const updatePassword = async (
    currentPassword: string,
    newPassword: string,
    token: string
): Promise<{ success?: boolean, error?: string }> => {
    if (!token) {
        return { error: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/users/me/password`,
        'PATCH',
        token,
        { currentPassword, newPassword }
    );

    if (response.error) {
        return { error: response.error || "Error updating password" };
    }

    return { success: true };
};