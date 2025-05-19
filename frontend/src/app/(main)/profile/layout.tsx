'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/organisms/AdminSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-white">
      {isAdmin && <AdminSidebar />}
      <main className={`flex-1 ${isAdmin ? 'bg-white' : 'bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%]'}`}>
        {children}
      </main>
    </div>
  );
} 