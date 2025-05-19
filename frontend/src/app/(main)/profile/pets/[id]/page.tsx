'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPetById } from '@/services/PetServices';
import { Pet } from '@/types/schemas';

export default function PetDetailsPage({ params }: { params: { id: string } }) {
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                const response = await getPetById(params.id, token);
                if (response.success && response.pet) {
                    setPet(response.pet);
                } else {
                    throw new Error(response.message || 'Error fetching pet details');
                }
            } catch (err) {
                console.error('Error fetching pet details:', err);
                setError(err instanceof Error ? err.message : 'Error connecting to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [params.id]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-gray-500 text-xl mb-4">Pet not found</div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Pet Details</h1>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    Back to List
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Pet Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <p className="mt-1 text-lg text-gray-800">{pet.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Species</label>
                                <p className="mt-1 text-lg text-gray-800">{pet.species}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Breed</label>
                                <p className="mt-1 text-lg text-gray-800">{pet.breed}</p>
                            </div>
                        </div>
                    </div>

                    {pet.owner && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Owner Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Name</label>
                                    <p className="mt-1 text-lg text-gray-800">{pet.owner.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">ID</label>
                                    <p className="mt-1 text-lg text-gray-800">{pet.owner.id}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 