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
    id?: string;
    name: string;
    species: string;
    breed?: string;
    color?: string;
    birthDate?: string;
    gender?: string;
    weight?: number;
    imageUrl?: string;
}

export interface PetResponse {
    data?: Pet;
    error?: string;
    success?: boolean;
}

export interface PetsListResponse {
    data?: Pet[];
    error?: string;
}