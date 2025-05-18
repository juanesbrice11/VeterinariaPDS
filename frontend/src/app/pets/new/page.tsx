'use client'
import React from 'react';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import CreatePetTemplate from '@/components/templates/CreatePetTemplate';

export default function CreatePetPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <CreatePetTemplate />
            <Footer />
        </div>
    );
} 