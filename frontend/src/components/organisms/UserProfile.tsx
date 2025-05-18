'use client'
import { getActualUser } from '@/services/UserServices';
import React, { useState, useEffect } from 'react';
import { UserResponse } from "@/types/schemas";
import Button from '@/components/atoms/Button';
import ProfileField from '@/components/molecules/ProfileField';
import ChangePasswordForm from '@/components/organisms/ChangePasswordForm';
import EditProfileForm from './EditProfileForm';
import { useRouter } from 'next/navigation';

const MyPets = [
    { id: '1', name: 'Firulais', species: 'Perro' },
    { id: '2', name: 'Misu', species: 'Gato' }
]

export default function UserProfile() {
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState(MyPets);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getActualUser();
                setUserData(data);
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handlePetClick = (petId: string) => {
        router.push(`/pets/${petId}/profile`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%] p-6 text-black">
            <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
            {loading ? (
                <p className="text-gray-600 animate-pulse">Loading profile...</p>
            ) : (
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <ProfileField label="Name" value={userData?.name} />
                            <ProfileField label="Email" value={userData?.email} />
                            <ProfileField label="Phone" value={userData?.phone} />
                        </div>
                        <div className="space-y-2">
                            <ProfileField label="Birth Date" value={userData?.birthDate} />
                            <ProfileField label="Gender" value={userData?.gender} />
                            <ProfileField label="Address" value={userData?.address} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <ProfileField label="Bio" value={userData?.bio} multiline />
                    </div>
                    <div className="flex justify-between items-center mt-4">
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
                        <Button
                            onClick={() => router.push('/schedule-appointment')}
                            variant='primary'
                        >
                            Schedule New Appointment
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
                                {userData && (
                                    <EditProfileForm
                                        initialData={{
                                            ...userData,
                                            birthDate: new Date(userData.birthDate).toISOString(),
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    
                </div>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">My Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {pets.map(pet => (
                    <div 
                        key={pet.id} 
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handlePetClick(pet.id)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${pet.species === 'Perro' ? 'bg-[#FFE9D2]' : 'bg-[#E2F0FB]'}`}>
                                {pet.species === 'Perro' ? (
                                    <span className="text-2xl">🐶</span>
                                ) : (
                                    <span className="text-2xl">🐱</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{pet.name}</h3>
                                <p className="text-gray-600 text-sm capitalize">{pet.species}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <button className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-[#2A3287]">
                    <span className="text-2xl">➕</span>
                    <span className="font-medium">Add New Pet</span>
                </button>
            </div>
        </div>
    );
}
