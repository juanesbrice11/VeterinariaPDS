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
    id: number;
    name: string;
    species: string;
    breed: string;
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

export interface ServiceAppointment {
    id: number;
    title: string;
    description: string;
}

export interface Service{
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VeterinarianAppointment {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface DetailedAppointment {
    id: number;
    appointmentDate: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
    pet: Pet;
    service: ServiceAppointment;
    veterinarian: VeterinarianAppointment;
}

export interface DetailedAppointmentResponse {
    success: boolean;
    message?: string;
    data?: DetailedAppointment[];
}

export interface Appointment {
    id: number;
    userId: number;
    petId: number;
    serviceId: number;
    veterinarianId?: number;
    appointmentDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    petName?: string;
    petSpecies?: string;
    serviceName?: string;
}

export interface AppointmentResponse {
    success: boolean;
    message?: string;
    appointments?: Appointment[];
}