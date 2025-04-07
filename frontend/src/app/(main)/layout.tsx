import Navbar from '@/components/organisms/Navbar';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Navbar />
            <div>{children}</div>
        </>
    );
}