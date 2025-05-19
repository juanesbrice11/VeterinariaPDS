import { UserProfile, UserResponse } from "@/types/schemas";
import { createAuthenticatedRequest } from "./ApiService";

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
        return { error: true, message: "Authentication error: Your session has expired" };
    }

    const data = await response.json();

    if (Array.isArray(data)) {
        return { data, status: response.status };
      }

    return { ...data, status: response.status };
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

// Obtener lista de usuarios (con paginación opcional)
export const getUsers = async (
    token: string,
    page: number = 1,
    limit: number = 8
  ): Promise<{ users: any[], total: number, status: number, message?: string }> => {
    if (!token) {
      return { users: [], total: 0, status: 401, message: "No active session" };
    }
  
    const resp = await createAuthenticatedRequest(
      `${API_URL}/users?page=${page}&limit=${limit}`,
      'GET',
      token
    );
    

    const rawUsers = Array.isArray((resp as any).data)
      ? (resp as any).data
      : (resp as any).users || [];
  
    const users = rawUsers.map((u:any) => ({
      ...u,
      cc: u.documentNumber
    }));
  
    const total = typeof (resp as any).total === 'number'
      ? (resp as any).total
      : users.length;
  
    return {
      users,
      total,
      status: resp.status,
      message: (resp as any).message
    };
  };

// Eliminar un usuario por ID
export const deleteUser = async (
    userId: number,
    token: string
): Promise<{ success: boolean, message: string }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }
    const response = await createAuthenticatedRequest(
        `${API_URL}/users/${userId}`,
        'DELETE',
        token
    );
    return {
        success: response.status === 200,
        message: response.message
    };
};