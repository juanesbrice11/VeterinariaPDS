'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
} 