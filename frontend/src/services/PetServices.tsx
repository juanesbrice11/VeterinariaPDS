import { Pet, PetResponse, PetsListResponse } from "@/types/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAuthenticatedRequest = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
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

    const petDataToSend = { ...petData };

    if (image) {
        const base64Image = await convertFileToBase64(image);
        petDataToSend.imageUrl = base64Image;
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets`,
        'POST',
        token,
        petDataToSend
    );
};

export const getPets = async (token: string): Promise<PetsListResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/pets`,
        'GET',
        token
    );

    if (response.error) {
        return { error: response.error };
    }

    return {
        data: response
    };
};

export const getPet = async (id: string, token: string): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/pets/${id}`,
        'GET',
        token
    );

    if (response.error) {
        return { error: response.error };
    }

    return {
        pet: response
    };
};

export const updatePet = async (
    id: string,
    petData: Partial<Pet>,
    token: string,
    image?: File
): Promise<PetResponse> => {
    if (!token) {
        return { error: "No hay sesión activa" };
    }

    const petDataToSend = { ...petData };

    if (image) {
        const base64Image = await convertFileToBase64(image);
        petDataToSend.imageUrl = base64Image;
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/${id}`,
        'PUT',
        token,
        petDataToSend
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

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}; 