import Footer from '@/components/organisms/Footer';
import Navbar from '@/components/organisms/Navbar';
import { ReactNode } from 'react';

export default function PetsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
            <Footer />
        </>
    );
}