import { Pet, PetResponse, PetsListResponse } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const createAuthenticatedRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    token: string,
    body?: object,
    isFormData = false
) => {
    const headers: HeadersInit = {
        "Authorization": `Bearer ${token}`
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    const requestOptions: RequestInit = {
        method,
        headers
    };

    if (body) {
        if (isFormData && body instanceof FormData) {
            requestOptions.body = body;
        } else if (!isFormData) {
            requestOptions.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return { error: "Error de autenticación: Tu sesión ha expirado" };
    }

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al procesar la respuesta JSON:", error);
        return { error: "Error al procesar la respuesta" };
    }
};

export const createPet = async (
    petData: Pet, 
    token: string,
    image?: File
): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    if (image) {
        const formData = new FormData();
        Object.entries(petData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        formData.append('image', image);

        return await createAuthenticatedRequest(
            `${API_URL}/pets`,
            'POST',
            token,
            formData,
            true
        );
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets`,
        'POST',
        token,
        petData
    );
};

export const getPets = async (token: string): Promise<PetsListResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets`,
        'GET',
        token
    );
};

export const getPet = async (id: string, token: string): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/${id}`,
        'GET',
        token
    );
};

export const updatePet = async (
    id: string,
    petData: Pet,
    token: string,
    image?: File
): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    if (image) {
        const formData = new FormData();
        Object.entries(petData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        formData.append('image', image);

        return await createAuthenticatedRequest(
            `${API_URL}/pets/${id}`,
            'PUT',
            token,
            formData,
            true
        );
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/${id}`,
        'PUT',
        token,
        petData
    );
};

export const deletePet = async (id: string, token: string): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/${id}`,
        'DELETE',
        token
    );
}; 