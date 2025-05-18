'use client';

import React from 'react';
import PetProfileTemplate from '@/components/templates/PetProfileTemplate';
import { useParams } from 'next/navigation';

export default function PetProfilePage() {
  const params = useParams();
  const petId = params.petId as string; // Extract petId from URL parameters

  if (!petId) {
    return <p>Loading pet profile or pet not found...</p>;
  }

  return <PetProfileTemplate petId={petId} />;
} 