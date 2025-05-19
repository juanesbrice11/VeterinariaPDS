'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getPets, updatePetAdmin, deletePet, deletePetAdmin } from '@/services/PetServices';
import { Pet } from '@/types/schemas';
import PetDetailsModal from '@/components/molecules/PetDetailsModal';
import EditPetModal from '@/components/molecules/EditPetModal';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
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
                    setFilteredPets(response.pets);
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

                // Check if user is admin or secretary
                if (user?.role === 'Admin' || user?.role === 'Secretary') {
                    const response = await deletePetAdmin(petId.toString(), token);
                    if (response.success) {
                        setPets(pets.filter(pet => pet.id !== petId));
                    } else {
                        throw new Error(response.message || 'Error deleting pet');
                    }
                } else {
                    // Use regular delete for normal users
                    const response = await deletePet(petId.toString(), token);
                    if (response.success) {
                        setPets(pets.filter(pet => pet.id !== petId));
                    } else {
                        throw new Error(response.message || 'Error deleting pet');
                    }
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
            const response = await updatePetAdmin(updatedPet.id.toString(), updatedPet, token);
            if (response.success) {
                // Actualizar ambas listas de mascotas
                const updatedPets = pets.map(pet => pet.id === updatedPet.id ? updatedPet : pet);
                setPets(updatedPets);
                setFilteredPets(updatedPets);
                setEditingPet(null);
            } else {
                throw new Error(response.message || 'Error updating pet');
            }
        } catch (err) {
            console.error('Error updating pet:', err);
            setError(err instanceof Error ? err.message : 'Error updating pet');
        }
    };

    // Función para filtrar mascotas por ID o nombre
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (!value.trim()) {
            setFilteredPets(pets);
            return;
        }

        const filtered = pets.filter(pet => 
            pet.id.toString().includes(value) ||
            pet.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPets(filtered);
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
                
                {/* Search Input */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search by ID or name..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
                    />
                </div>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Species</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Breed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPets.length > 0 ? (
                                filteredPets.map((pet) => (
                                    <tr key={pet.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pet.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.species}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.breed}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pet.owner?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-4">
                                                <button
                                                    onClick={() => setSelectedPet(pet)}
                                                    className="text-emerald-600 hover:text-emerald-700 transition-colors"
                                                    title="View Details"
                                                >
                                                    <FaEye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(pet)}
                                                    className="text-amber-600 hover:text-amber-700 transition-colors"
                                                    title="Edit Pet"
                                                >
                                                    <FaEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pet.id)}
                                                    className="text-rose-500 hover:text-rose-600 transition-colors"
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
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                        {searchTerm ? 'No pets found matching your search' : 'No pets registered'}
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