'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getMyPets, getAllPets, updatePetAdmin, deletePet, deletePetAdmin } from '@/services/PetServices';
import { Pet } from '@/types/schemas';
import PetDetailsModal from '@/components/molecules/PetDetailsModal';
import EditPetModal from '@/components/molecules/EditPetModal';
import { FaEye, FaEdit, FaTrash, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function VetPets() {
    const { user } = useAuth();
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchPets = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            console.log('Fetching pets for role:', user?.role);
            
            // Usar getAllPets si el usuario es administrador o veterinario, de lo contrario usar getMyPets
            const response = user?.role === 'Admin' || user?.role === 'Veterinario'
                ? await getAllPets(token)
                : await getMyPets(token);
                
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

    useEffect(() => {
        fetchPets();
    }, [user]);

    const handleEdit = (pet: Pet) => {
        setEditingPet(pet);
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await deletePetAdmin(id.toString(), token);
            
            if (response.success) {
                // Actualizar la lista de mascotas después de eliminar
                await fetchPets();
                toast.success('Pet deleted successfully');
            } else {
                throw new Error(response.message || 'Error deleting pet');
            }
        } catch (err) {
            console.error('Error deleting pet:', err);
            setError(err instanceof Error ? err.message : 'Error deleting pet');
            toast.error('Error deleting pet');
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
                toast.success('Pet updated successfully');
            } else {
                throw new Error(response.message || 'Error updating pet');
            }
        } catch (err) {
            console.error('Error updating pet:', err);
            setError(err instanceof Error ? err.message : 'Error updating pet');
            toast.error('Error updating pet');
        }
    };

    // Función para filtrar mascotas por ID o nombre
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page on search
        
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

    // Pagination logic
    const indexOfLastPet = currentPage * itemsPerPage;
    const indexOfFirstPet = indexOfLastPet - itemsPerPage;
    const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Pet Management</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading pets...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Pet Management</h1>
                
                <div className="flex items-center space-x-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by name, species or breed..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

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
                        {currentPets.length > 0 ? (
                            currentPets.map((pet) => (
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
                                            {user?.role === 'Admin' && (
                                                <button
                                                    onClick={() => handleDelete(pet.id)}
                                                    className="text-rose-500 hover:text-rose-600 transition-colors"
                                                    title="Delete Pet"
                                                >
                                                    <FaTrash size={18} />
                                                </button>
                                            )}
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

            {/* Pagination */}
            {filteredPets.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstPet + 1} to {Math.min(indexOfLastPet, filteredPets.length)} of {filteredPets.length} pets
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {/* Pet Details Modal */}
            {selectedPet && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedPet.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Species</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedPet.species}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Breed</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedPet.breed}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Owner</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedPet.owner?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedPet(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Pet Modal */}
            {editingPet && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Pet</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingPet.name}
                                    onChange={(e) => setEditingPet({...editingPet, name: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Species</label>
                                <input
                                    type="text"
                                    value={editingPet.species}
                                    onChange={(e) => setEditingPet({...editingPet, species: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Breed</label>
                                <input
                                    type="text"
                                    value={editingPet.breed}
                                    onChange={(e) => setEditingPet({...editingPet, breed: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingPet(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveEdit(editingPet)}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 