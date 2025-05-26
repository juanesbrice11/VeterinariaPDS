'use client';

import React from 'react';
import MedicalRecordsTable from '@/components/organisms/MedicalRecordsTable';
import AdminSidebar from '@/components/organisms/AdminSidebar';
import VetSidebar from '@/components/organisms/VetSidebar';
import Navbar from '@/components/organisms/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function MedicalRecordsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex bg-white">
        {user?.role === 'Admin' ? <AdminSidebar /> : <VetSidebar />}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto bg-white">
            <MedicalRecordsTable />
          </div>
        </main>
      </div>
    </div>
  );
} 