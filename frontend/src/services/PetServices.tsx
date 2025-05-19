import { Pet, PetResponse, PetsListResponse } from "@/types/schemas";
import { createAuthenticatedRequest } from "./ApiService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPet = async (
    petData: Pet,
    token: string,
    image?: File
): Promise<PetResponse> => {
    if (!token) {
        return { error: "No active session" };
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

export const getPets = async (token: string): Promise<{ success: boolean, message?: string, pets?: Pet[] }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    const response = await createAuthenticatedRequest(
        `${API_URL}/pets`,
        'GET',
        token
    );

    const petsArray = response.status === 200
        ? Object.keys(response)
            .filter(key => key !== 'status')
            .map(key => response[key])
        : [];

    return {
        success: response.status === 200,
        pets: petsArray
    };
};

export const getPet = async (id: string, token: string): Promise<PetResponse> => {
    if (!token) {
        return { error: "No active session" };
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
        return { error: "No active session" };
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
        return { error: "No active session" };
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