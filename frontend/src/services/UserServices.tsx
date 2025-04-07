import { UserProfile, UserResponse } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token = localStorage.getItem("token");

export const getActualUser = async (): Promise<UserResponse> => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    return await response.json();
}

export const updateUser = async (userData: UserProfile): Promise<void> => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });
}

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            currentPassword,
            newPassword,
        }),
    });
}