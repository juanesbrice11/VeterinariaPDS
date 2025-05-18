'use client';

import React from 'react';
import PetProfileTemplate from '@/components/templates/PetProfileTemplate';
import { useParams } from 'next/navigation';

export default function PetProfilePage() {
  const params = useParams();
  const petId = params.petId as string; // Extract petId from URL parameters

  if (!petId) {
    // Handle the case where petId is not available, e.g., show a loading state or an error
    return <p>Loading pet profile or pet not found...</p>;
  }

  return <PetProfileTemplate petId={petId} />;
} 