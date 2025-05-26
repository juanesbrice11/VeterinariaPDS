'use client';

import React from 'react';
import MedicalRecordsTable from '@/components/organisms/MedicalRecordsTable';
import AdminSidebar from '@/components/organisms/AdminSidebar';
import VetSidebar from '@/components/organisms/VetSidebar';
import { useAuth } from '@/context/AuthContext';

export default function MedicalRecordsPage() {
  const { user } = useAuth();

  return (
    <div className="flex">
      {user?.role === 'Admin' ? <AdminSidebar /> : <VetSidebar />}
      <div className="flex-1">
        <MedicalRecordsTable />
      </div>
    </div>
  );
} 