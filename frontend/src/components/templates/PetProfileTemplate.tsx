'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';

// Interfaces para los datos de la mascota y el historial clínico (ejemplo)
interface PetDetails {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  ownerName: string; // O podrías tener un ownerId para enlazar a datos del usuario
  imageUrl?: string; // Opcional
}

interface ClinicalHistoryEntry {
  id: string;
  visitDate: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  vetName: string;
  notes?: string;
}

interface PetProfileTemplateProps {
  petId: string;
}

// Datos de ejemplo
const MOCK_PET_DATABASE: PetDetails[] = [
  { id: '1', name: 'Firulais', species: 'Perro', breed: 'Labrador', birthDate: '2020-01-15', ownerName: 'John Doe', imageUrl: 'https://via.placeholder.com/150/FFE9D2/000000?Text=Firulais' },
  { id: '2', name: 'Misu', species: 'Gato', breed: 'Siames', birthDate: '2021-05-20', ownerName: 'Jane Doe', imageUrl: 'https://via.placeholder.com/150/E2F0FB/000000?Text=Misu' },
  { id: '3', name: 'Rex', species: 'Perro', breed: 'Pastor Alemán', birthDate: '2019-11-02', ownerName: 'John Doe', imageUrl: 'https://via.placeholder.com/150/FFE9D2/000000?Text=Rex' },
  { id: '4', name: 'Luna', species: 'Gato', breed: 'Persa', birthDate: '2022-03-10', ownerName: 'Jane Doe', imageUrl: 'https://via.placeholder.com/150/E2F0FB/000000?Text=Luna' },
];

const MOCK_CLINICAL_HISTORY: Record<string, ClinicalHistoryEntry[]> = {
  '1': [
    { id: 'h1', visitDate: '2023-03-01', reason: 'Chequeo Anual', diagnosis: 'Saludable', treatment: 'Ninguno', vetName: 'Dr. Smith' },
    { id: 'h2', visitDate: '2023-08-15', reason: 'Vacunación', diagnosis: 'N/A', treatment: 'Vacuna Rabia', vetName: 'Dr. Smith', notes: 'Refuerzo anual' },
  ],
  '2': [
    { id: 'h3', visitDate: '2023-06-10', reason: 'Estornudos', diagnosis: 'Resfriado leve', treatment: 'Reposo y observación', vetName: 'Dr. Jones' },
  ],
  // Añadir más historiales si es necesario
};

const PetProfileTemplate: React.FC<PetProfileTemplateProps> = ({ petId }) => {
  const [petData, setPetData] = useState<PetDetails | null>(null);
  const [clinicalHistory, setClinicalHistory] = useState<ClinicalHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la carga de datos
    setLoading(true);
    const foundPet = MOCK_PET_DATABASE.find(p => p.id === petId);
    const foundHistory = MOCK_CLINICAL_HISTORY[petId] || [];

    setTimeout(() => { // Simular delay de red
      setPetData(foundPet || null);
      setClinicalHistory(foundHistory);
      setLoading(false);
    }, 500);
  }, [petId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p className="text-xl animate-pulse">Loading pet profile...</p>
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
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Pet Information Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            {petData.imageUrl && (
              <img 
                src={petData.imageUrl} 
                alt={petData.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-200 shadow-md"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A3287]">{petData.name}</h1>
              <p className="text-lg text-gray-600">{petData.species} - {petData.breed}</p>
              <p className="text-sm text-gray-500">Born on: {new Date(petData.birthDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Owner: {petData.ownerName}</p>
            </div>
          </div>

          {/* Clinical History Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-[#2A3287]">Clinical History</h2>
            {clinicalHistory.length > 0 ? (
              <div className="space-y-6">
                {clinicalHistory.map((entry) => (
                  <div key={entry.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-800">Visit on: {new Date(entry.visitDate).toLocaleDateString()}</h3>
                    <p className="text-sm text-gray-600"><span className="font-medium">Vet:</span> {entry.vetName}</p>
                    <p className="text-sm text-gray-600 capitalize"><span className="font-medium">Reason:</span> {entry.reason}</p>
                    <p className="text-sm text-gray-600 capitalize"><span className="font-medium">Diagnosis:</span> {entry.diagnosis}</p>
                    <p className="text-sm text-gray-600 capitalize"><span className="font-medium">Treatment:</span> {entry.treatment}</p>
                    {entry.notes && <p className="text-sm text-gray-500 mt-1"><span className="font-medium">Notes:</span> {entry.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No clinical history found for {petData.name}.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PetProfileTemplate; 