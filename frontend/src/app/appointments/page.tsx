'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import AppointmentsTable from '@/components/organisms/AppointmentsTable';
import { withAuth } from '@/components/hoc/withAuth';

function AppointmentsPage() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="absolute inset-0 -z-10">
                <Image
                    src="/assets/Background.png"
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    priority
                />
            </div>

            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <AppointmentsTable />
            </main>
            <Footer />
        </div>
    );
}

export default withAuth(AppointmentsPage); 