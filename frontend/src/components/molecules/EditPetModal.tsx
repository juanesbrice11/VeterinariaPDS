import React, { useState } from 'react';
import { Pet } from '@/types/schemas';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

interface EditPetModalProps {
    pet: Pet;
    onClose: () => void;
    onSave: (updatedPet: Pet) => void;
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

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onSave }) => {
    const [editedPet, setEditedPet] = useState<Pet>({ ...pet });
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedPet(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedPet);
        setShowConfirmation(true);
        
        // Esperamos 2 segundos completos antes de cerrar
        setTimeout(() => {
            setShowConfirmation(false);
            onClose();
        }, 2000);
    };

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
                    {/* Confirmation Message */}
                    {showConfirmation && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-lg animate-fade-in">
                            <div className="text-center">
                                <FaCheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Changes Saved!</h3>
                                <p className="text-gray-600">The pet information has been updated successfully.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Edit Pet</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Pet Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pet Information</h3>
                            
                            {/* Pet Header with Emoji */}
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-[#FFE9D2] flex items-center justify-center text-4xl">
                                    {getAnimalEmoji(editedPet.species, editedPet.breed)}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedPet.name}
                                        onChange={handleChange}
                                        className="text-xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none px-1 py-1 w-full text-gray-900"
                                        placeholder="Pet Name"
                                    />
                                    <p className="text-gray-600 capitalize mt-2">
                                        {editedPet.species} {editedPet.breed ? `- ${editedPet.breed}` : ''}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">ID: #{editedPet.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Species</label>
                                    <select
                                        name="species"
                                        value={editedPet.species}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                    >
                                        <option value="dog">Dog</option>
                                        <option value="cat">Cat</option>
                                        <option value="bird">Bird</option>
                                        <option value="fish">Fish</option>
                                        <option value="hamster">Hamster</option>
                                        <option value="rabbit">Rabbit</option>
                                        <option value="turtle">Turtle</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Breed</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={editedPet.breed || ''}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                        placeholder="Enter breed"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={editedPet.birthDate ? new Date(editedPet.birthDate).toISOString().split('T')[0] : ''}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={editedPet.color || ''}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                        placeholder="Enter color"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={editedPet.gender || ''}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={editedPet.weight || ''}
                                        onChange={handleChange}
                                        step="0.1"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 bg-white text-gray-900"
                                        placeholder="Enter weight"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditPetModal; 