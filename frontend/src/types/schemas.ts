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