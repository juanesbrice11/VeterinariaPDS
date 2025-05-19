import React from 'react';
import { Pet } from '@/types/schemas';
import { FaTimes } from 'react-icons/fa';

interface PetDetailsModalProps {
    pet: Pet;
    onClose: () => void;
}

const getAnimalEmoji = (species: string, breed?: string): string => {
    const speciesLower = species.toLowerCase();
    const breedLower = breed?.toLowerCase() || '';

    if (speciesLower === 'cat' || speciesLower === 'gato') {
        if (breedLower.includes('siamese') || breedLower.includes('siamés')) return '🐱';
        if (breedLower.includes('persian') || breedLower.includes('persa')) return '😺';
        if (breedLower.includes('angora')) return '😸';
        return '🐈';
    }

    if (speciesLower === 'dog' || speciesLower === 'perro') {
        if (breedLower.includes('labrador')) return '🦮';
        if (breedLower.includes('german') || breedLower.includes('pastor alemán')) return '🐕‍🦺';
        if (breedLower.includes('poodle') || breedLower.includes('caniche')) return '🐩';
        return '🐕';
    }

    if (speciesLower === 'bird' || speciesLower === 'pájaro' || speciesLower === 'ave') return '🦜';
    if (speciesLower === 'fish' || speciesLower === 'pez') return '🐠';
    if (speciesLower === 'hamster') return '🐹';
    if (speciesLower === 'rabbit' || speciesLower === 'conejo') return '🐰';
    if (speciesLower === 'turtle' || speciesLower === 'tortuga') return '🐢';

    return '🐾';
};

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({ pet, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/10 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Pet Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Pet Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Information</h3>
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-[#FFE9D2] flex items-center justify-center text-4xl">
                                    {getAnimalEmoji(pet.species, pet.breed)}
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{pet.name}</h4>
                                    <p className="text-gray-600 capitalize">{pet.species} {pet.breed ? `- ${pet.breed}` : ''}</p>
                                    <p className="text-sm text-gray-500">ID: #{pet.id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {pet.birthDate && (
                                    <div>
                                        <p className="text-sm text-gray-500">Birth Date</p>
                                        <p className="text-gray-900">{new Date(pet.birthDate).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {pet.color && (
                                    <div>
                                        <p className="text-sm text-gray-500">Color</p>
                                        <p className="text-gray-900 capitalize">{pet.color}</p>
                                    </div>
                                )}
                                {pet.gender && (
                                    <div>
                                        <p className="text-sm text-gray-500">Gender</p>
                                        <p className="text-gray-900 capitalize">
                                            {pet.gender === 'M' ? 'Male' : pet.gender === 'F' ? 'Female' : pet.gender}
                                        </p>
                                    </div>
                                )}
                                {pet.weight && (
                                    <div>
                                        <p className="text-sm text-gray-500">Weight</p>
                                        <p className="text-gray-900">{pet.weight} kg</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Owner Information */}
                        {pet.owner && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="text-gray-900">{pet.owner.name}</p>
                                    </div>
                                    {pet.owner.email && (
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900">{pet.owner.email}</p>
                                        </div>
                                    )}
                                    {pet.owner.phone && (
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-900">{pet.owner.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PetDetailsModal; 