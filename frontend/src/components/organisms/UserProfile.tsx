'use client'
import React, { useState, useEffect } from 'react';
import { UserResponse, Pet } from "@/types/schemas";
import Button from '@/components/atoms/Button';
import ProfileField from '@/components/molecules/ProfileField';
import ChangePasswordForm from '@/components/organisms/ChangePasswordForm';
import EditProfileForm from './EditProfileForm';
import { useRouter } from 'next/navigation';
import { useUserServices } from '@/hooks/useUserServices';
import { withAuth } from '@/components/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { getMyPets } from '@/services/PetServices';

const getSpeciesEmoji = (species: string): string => {
    const speciesLower = species.toLowerCase();
    switch (speciesLower) {
        case 'dog':
            return '🐶';
        case 'cat':
            return '🐱';
        case 'bird':
            return '🦜';
        case 'fish':
            return '🐠';
        case 'rabbit':
            return '🐇';
        case 'hamster':
            return '🐹';
        case 'turtle':
            return '🐢';
        default:
            return '🐾';
    }
};

function UserProfile() {
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [pets, setPets] = useState<Pet[]>([]);
    const [petsLoading, setPetsLoading] = useState(true);
    const [petsError, setPetsError] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const { fetchUserProfile, isLoading, error } = useUserServices();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const loadUserProfile = async () => {
            if (!isAuthenticated || !isClient) return;
            
            try {
                const userProfile = await fetchUserProfile();
                if (userProfile) {
                    setUserData(userProfile);
                }
            } catch (e) {
                console.error("Failed to load profile:", e);
            }
        };

        loadUserProfile();
    }, [isAuthenticated, fetchUserProfile, isClient]);

    useEffect(() => {
        const fetchUserPets = async () => {
            if (!isAuthenticated || !isClient) return;

            setPetsLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const response = await getMyPets(token);
                console.log('Pets response:', response);
                
                if (response.success && response.pets) {
                    setPets(response.pets);
                } else if (Array.isArray(response)) {
                    setPets(response);
                } else {
                    setPetsError(response.message || 'Unexpected response format');
                }
            } catch (err) {
                console.error("Failed to load pets:", err);
                setPetsError('Failed to load pets');
            } finally {
                setPetsLoading(false);
            }
        };

        if (isClient) {
            fetchUserPets();
        }
    }, [isAuthenticated, isClient]);

    const handlePetClick = (petId: string | number) => {
        const petIdString = petId.toString();
        router.push(`/pets/${petIdString}/profile`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%] p-6 text-black">
                <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%] p-6 text-black">
                <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <p className="text-red-500 mb-4">Error loading profile: {error}</p>
                    <Button
                        onClick={() => router.push('/login')}
                        variant='primary'
                    >
                        Return to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%] p-6 text-black">
            <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

            {userData ? (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <ProfileField label="Name" value={userData.name} />
                            <ProfileField label="Email" value={userData.email} />
                            <ProfileField label="Phone" value={userData.phone} />
                        </div>
                        <div className="space-y-2">
                            <ProfileField label="Birth Date" value={userData.birthDate} />
                            <ProfileField label="Gender" value={userData.gender === 'M' ? 'Male' : userData.gender === 'F' ? 'Female' : userData.gender === 'O' ? 'Other' : userData.gender} />
                            <ProfileField label="Address" value={userData.address} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <ProfileField label="Bio" value={userData.bio} multiline />
                    </div>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowEditForm(true)}
                            variant='primary'
                        >
                            Edit Profile
                        </Button>
                        <Button
                            onClick={() => setShowPasswordForm(true)}
                            variant='secondary'
                        >
                            Change Password
                        </Button>
                    </div>

                    {showPasswordForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="relative">
                                <button
                                    onClick={() => setShowPasswordForm(false)}
                                    className="absolute -top-10 right-0 text-white text-2xl"
                                >
                                    ×
                                </button>
                                <ChangePasswordForm />
                            </div>
                        </div>
                    )}

                    {showEditForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="relative">
                                <button
                                    onClick={() => setShowEditForm(false)}
                                    className="absolute -top-10 right-0 text-white text-2xl"
                                >
                                    ×
                                </button>
                                <EditProfileForm
                                    initialData={{
                                        name: userData.name || '',
                                        email: userData.email || '',
                                        phone: userData.phone || '',
                                        birthDate: userData.birthDate || '',
                                        gender: userData.gender || '',
                                        address: userData.address || '',
                                        bio: userData.bio || ''
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">No profile data available.</p>
                </div>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">My Pets</h2>

            {petsLoading ? (
                <div className="max-w-2xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading your pets...</p>
                </div>
            ) : petsError ? (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-4">
                    <p className="text-red-500">{petsError}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {pets.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 bg-white rounded-xl p-6 shadow-md text-center">
                            <div className="text-5xl mb-3">🐾</div>
                            <h3 className="font-semibold text-lg mb-2">No pets registered yet</h3>
                            <p className="text-gray-600 mb-4">Add your first pet to keep track of their health records</p>
                        </div>
                    ) : (
                        pets.map(pet => (
                            <div
                                key={pet.id}
                                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handlePetClick(pet.id ?? 0)}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-full bg-[#FFE9D2]">
                                        <span className="text-2xl">{getSpeciesEmoji(pet.species)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{pet.name}</h3>
                                        <p className="text-gray-600 text-sm capitalize">{pet.species}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <Link href="/pets/new" className="block">
                        <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-[#2A3287] h-full">
                            <span className="text-2xl">➕</span>
                            <span className="font-medium">Add New Pet</span>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default withAuth(UserProfile);
