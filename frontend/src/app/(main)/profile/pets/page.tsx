'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getPets, updatePet, deletePet } from '@/services/PetServices';
import { Pet } from '@/types/schemas';
import PetDetailsModal from '@/components/molecules/PetDetailsModal';
import EditPetModal from '@/components/molecules/EditPetModal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                console.log('Fetching pets...');
                const response = await getPets(token);
                console.log('Pets response:', response);
                
                if (response.success && response.pets) {
                    console.log('Setting pets:', response.pets);
                    setPets(response.pets);
                } else {
                    throw new Error(response.message || 'Error fetching pets');
                }
            } catch (err) {
                console.error('Error fetching pets:', err);
                setError(err instanceof Error ? err.message : 'Error connecting to the server');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const handleEdit = (pet: Pet) => {
        setEditingPet(pet);
    };

    const handleDelete = async (petId: number) => {
        if (window.confirm('Are you sure you want to delete this pet?')) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }
                const response = await deletePet(petId.toString(), token);
                if (response.success) {
                    setPets(pets.filter(pet => pet.id !== petId));
                } else {
                    throw new Error(response.message || 'Error deleting pet');
                }
            } catch (err) {
                console.error('Error deleting pet:', err);
                setError(err instanceof Error ? err.message : 'Error deleting pet');
            }
        }
    };

    const handleSaveEdit = async (updatedPet: Pet) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await updatePet(updatedPet.id.toString(), updatedPet, token);
            if (response.success) {
                setPets(pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet));
                setEditingPet(null);
            } else {
                throw new Error(response.message || 'Error updating pet');
            }
        } catch (err) {
            console.error('Error updating pet:', err);
            setError(err instanceof Error ? err.message : 'Error updating pet');
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => router.refresh()}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Pets</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Species</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Breed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pets.length > 0 ? (
                                pets.map((pet) => (
                                    <tr key={pet.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">#{pet.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{pet.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{pet.species}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{pet.breed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{pet.owner?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => setSelectedPet(pet)}
                                                    className="text-emerald-500 hover:text-emerald-700 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(pet)}
                                                    className="text-amber-500 hover:text-amber-700 transition-colors"
                                                    title="Edit Pet"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pet.id)}
                                                    className="text-rose-400 hover:text-rose-600 transition-colors"
                                                    title="Delete Pet"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                        No pets registered
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedPet && (
                <PetDetailsModal
                    pet={selectedPet}
                    onClose={() => setSelectedPet(null)}
                />
            )}

            {editingPet && (
                <EditPetModal
                    pet={editingPet}
                    onClose={() => setEditingPet(null)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
} 