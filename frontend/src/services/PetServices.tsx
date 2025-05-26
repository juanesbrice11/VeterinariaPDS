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

    console.log('Making request to pets/all...');
    const response = await createAuthenticatedRequest(
        `${API_URL}/pets/all`,
        'GET',
        token
    );

    console.log('Response from pets/all:', response);

    if (response.error) {
        return { success: false, message: response.message || 'Error fetching pets' };
    }

    // Verificar si la respuesta tiene el formato esperado
    if (response.success && Array.isArray(response.pets)) {
        return {
            success: true,
            pets: response.pets
        };
    }

    // Si la respuesta es un array directo (formato antiguo)
    if (Array.isArray(response)) {
        return {
            success: true,
            pets: response
        };
    }

    return { 
        success: false, 
        message: 'Formato de respuesta inesperado' 
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
        petDataToSend.image = base64Image;
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

export const deletePetAdmin = async (id: string, token: string): Promise<PetResponse> => {
    if (!token) {
        return { error: "No active session" };
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/admin/${id}`,
        'DELETE',
        token
    );
};

export const getPetById = async (id: string, token: string): Promise<PetResponse> => {
    try {
        // Primero obtener el rol del usuario
        const userResponse = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!userResponse.ok) {
            throw new Error('Error fetching user data');
        }

        const userData = await userResponse.json();
        const isAdminOrSecretary = userData.role === 'Admin' || userData.role === 'Secretary';

        // Usar el endpoint apropiado según el rol
        const endpoint = isAdminOrSecretary ? `/pets/Secretary/${id}` : `/pets/${id}`;
        console.log('Using endpoint:', endpoint);

        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Pet details response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching pet details');
        }

        return {
            success: true,
            pet: data
        };
    } catch (error) {
        console.error('Error in getPetById:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Error fetching pet details'
        };
    }
};

export const getMyPets = async (token: string): Promise<{ success: boolean, message?: string, pets?: Pet[] }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/pets`,
            'GET',
            token
        );

        console.log('Raw response from API:', response);

        // Si la respuesta tiene el formato { data, status }
        if (response.data && Array.isArray(response.data)) {
            return {
                success: true,
                pets: response.data
            };
        }

        // Si la respuesta es un array directo
        if (Array.isArray(response)) {
            return {
                success: true,
                pets: response
            };
        }

        // Si la respuesta tiene el formato { success, pets }
        if (response.success && Array.isArray(response.pets)) {
            return {
                success: true,
                pets: response.pets
            };
        }

        // Si la respuesta tiene un mensaje de error
        if (response.message) {
            return {
                success: false,
                message: response.message
            };
        }

        // Si la respuesta es un objeto con error
        if (response.error) {
            return {
                success: false,
                message: response.error
            };
        }

        // Si no se pudo determinar el formato
        return { 
            success: false, 
            message: 'Formato de respuesta inesperado' 
        };
    } catch (error) {
        console.error('Error in getMyPets:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error fetching pets'
        };
    }
};

export const getAllPets = async (token: string): Promise<{ success: boolean, message?: string, pets?: Pet[] }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/pets/all`,
            'GET',
            token
        );

        console.log('Raw response from getAllPets:', response);

        // Si la respuesta tiene el formato { data, status }
        if (response.data && Array.isArray(response.data)) {
            console.log('Response has data array:', response.data);
            return {
                success: true,
                pets: response.data
            };
        }

        // Si la respuesta es un array directo
        if (Array.isArray(response)) {
            console.log('Response is direct array:', response);
            return {
                success: true,
                pets: response
            };
        }

        // Si la respuesta tiene el formato { success, pets }
        if (response.success && Array.isArray(response.pets)) {
            console.log('Response has success and pets:', response.pets);
            return {
                success: true,
                pets: response.pets
            };
        }

        // Si la respuesta tiene un mensaje de error
        if (response.message) {
            console.log('Response has error message:', response.message);
            return {
                success: false,
                message: response.message
            };
        }

        // Si la respuesta es un objeto con error
        if (response.error) {
            console.log('Response has error:', response.error);
            return {
                success: false,
                message: response.error
            };
        }

        // Si no se pudo determinar el formato
        console.log('Unexpected response format:', response);
        return { 
            success: false, 
            message: 'Formato de respuesta inesperado' 
        };
    } catch (error) {
        console.error('Error in getAllPets:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error fetching pets'
        };
    }
};

export const updatePetAdmin = async (
    id: string,
    petData: Partial<Pet>,
    token: string,
    image?: File
): Promise<PetResponse> => {
    if (!token) {
        return { success: false, error: "No active session" };
    }

    const petDataToSend = { ...petData };

    if (image) {
        const base64Image = await convertFileToBase64(image);
        petDataToSend.imageUrl = base64Image;
    }

    return await createAuthenticatedRequest(
        `${API_URL}/pets/admin/${id}`,
        'PUT',
        token,
        petDataToSend
    );
};

export const getAllPetsVet = async (token: string): Promise<{ success: boolean, message?: string, pets?: Pet[] }> => {
    if (!token) {
        return { success: false, message: "No active session" };
    }

    try {
        const response = await createAuthenticatedRequest(
            `${API_URL}/pets/vet/all`,
            'GET',
            token
        );

        console.log('Raw response from getAllPetsVet:', response);

        if (response.success && Array.isArray(response.pets)) {
            return {
                success: true,
                pets: response.pets
            };
        }

        if (response.message) {
            return {
                success: false,
                message: response.message
            };
        }

        return { 
            success: false, 
            message: 'Formato de respuesta inesperado' 
        };
    } catch (error) {
        console.error('Error in getAllPetsVet:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error fetching pets'
        };
    }
};

const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}; 
