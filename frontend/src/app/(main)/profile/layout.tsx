'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/organisms/AdminSidebar';
import VetSidebar from '@/components/organisms/VetSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isVet = user?.role === 'Veterinario';

  console.log('User role:', user?.role); // Para debugging

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-white">
      {isAdmin && <AdminSidebar />}
      {isVet && <VetSidebar />}
      <main className={`flex-1 ${isAdmin || isVet ? 'ml-0 bg-white' : 'bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%]'}`}>
        {children}
      </main>
    </div>
  );
} 