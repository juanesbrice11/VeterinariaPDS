'use client'
import React, { useState, useEffect } from 'react';
import { Pet } from "@/types/schemas";
import { getAllPets } from '@/services/PetServices';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import Link from 'next/link';

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

function AdminPetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchPets = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await getAllPets(token);
                console.log('Pets response:', response);

                if (response.success && response.pets) {
                    setPets(response.pets);
                } else {
                    setError(response.message || 'Error al cargar las mascotas');
                }
            } catch (err) {
                console.error("Failed to load pets:", err);
                setError('Error al cargar las mascotas');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Administración de Mascotas</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando mascotas...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Administración de Mascotas</h1>
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Administración de Mascotas</h1>
                <Link href="/pets/new" className="bg-[#2A3287] text-white px-4 py-2 rounded hover:bg-[#1a1f5c] transition-colors">
                    Agregar Nueva Mascota
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mascota
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dueño
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Especie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Raza
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                    No hay mascotas registradas
                                </td>
                            </tr>
                        ) : (
                            pets.map((pet) => (
                                <tr key={pet.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[#FFE9D2] rounded-full">
                                                <span className="text-xl">{getSpeciesEmoji(pet.species)}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {pet.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{pet.owner?.name || 'Sin dueño'}</div>
                                        <div className="text-sm text-gray-500">{pet.owner?.email || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{pet.species}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{pet.breed || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            href={`/pets/${pet.id}/profile`}
                                            className="text-[#2A3287] hover:text-[#1a1f5c] mr-4"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            href={`/pets/${pet.id}/edit`}
                                            className="text-orange-500 hover:text-orange-700 mr-4"
                                        >
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default withAuth(AdminPetsPage); 