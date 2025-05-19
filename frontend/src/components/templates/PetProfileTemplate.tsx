'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { getPet } from '@/services/PetServices';
import { Pet } from '@/types/schemas';
import { useAuth } from '@/context/AuthContext';

interface PetProfileTemplateProps {
  petId: string;
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

const PetProfileTemplate: React.FC<PetProfileTemplateProps> = ({ petId }) => {
  const [petData, setPetData] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPetData = async () => {
      if (!isAuthenticated) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await getPet(petId, token);

        if (response.error) {
          throw new Error(response.error);
        }

        if (!response.pet) {
          throw new Error('Pet not found');
        }

        setPetData(response.pet);
      } catch (err) {
        console.error('Error fetching pet:', err);
        setError(err instanceof Error ? err.message : 'Error loading pet data');
        setPetData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPetData();
  }, [petId, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading pet profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p className="text-xl text-red-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!petData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p className="text-xl text-red-600">Pet not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%] text-black">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-100 flex items-center justify-center text-6xl">
              {getAnimalEmoji(petData.species, petData.breed)}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-black">{petData.name}</h1>
              <p className="text-lg text-gray-600 capitalize">{petData.species} {petData.breed ? `- ${petData.breed}` : ''}</p>
              {petData.birthDate && (
                <p className="text-sm text-gray-500">Born on: {new Date(petData.birthDate).toLocaleDateString()}</p>
              )}
              {petData.color && (
                <p className="text-sm text-gray-500 capitalize">Color: {petData.color}</p>
              )}
              {petData.gender && (
                <p className="text-sm text-gray-500 capitalize">Gender: {petData.gender === 'M' ? 'Male' : petData.gender === 'F' ? 'Female' : petData.gender}</p>
              )}
              {petData.weight && (
                <p className="text-sm text-gray-500">Weight: {petData.weight} kg</p>
              )}
            </div>
          </div>

          {/* Clinical History Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-black">Clinical History</h2>
            <p className="text-gray-500">No clinical history available yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PetProfileTemplate; 