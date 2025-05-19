'use client';

import React from 'react';
import Footer from '@/components/organisms/Footer';
import Navbar from '@/components/organisms/Navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}