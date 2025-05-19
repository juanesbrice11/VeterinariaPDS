'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminSidebar from '@/components/organisms/AdminSidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'Admin') {
      router.push('/profile');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'Admin') {
    return null;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
} 