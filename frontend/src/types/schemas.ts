export type UserResponse = {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
    error?: string;
};

export type RegisterUserData = {
    name: string;
    email: string;
    password: string;
    documentType: string;
    documentNumber: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    bio: string;
};

export type UserProfile = {
    name: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    address: string;
    bio: string;
}

export interface Pet {
    id?: number;
    name: string;
    species: string;
    breed?: string;
    color?: string;
    birthDate?: string;
    gender?: string;
    weight?: number;
    ownerId?: number;
    createdAt?: string;
    updatedAt?: string;
    imageUrl?: string;
}

export interface PetResponse {
    message?: string;
    pet?: Pet;
    error?: string;
}

export interface PetsListResponse {
    data?: Pet[];
    error?: string;
    message?: string;
}