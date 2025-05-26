'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NavLinks() {
    const { isAuthenticated, loading } = useAuth();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        ...(isAuthenticated ? [{ href: '/appointments', label: 'Appointments' }] : []),
    ];

    if (loading) {
        return <nav className="flex space-x-8 font-instrument-sans font-bold">
            {['Home', 'Services', 'About'].map((label) => (
                <span key={label} className="text-[#08162E] text-[20px] font-bold not-italic leading-normal [text-stroke-width:1px] [text-stroke-color:#08162E] font-instrument-sans mx-[40px]">
                    {label}
                </span>
            ))}
        </nav>;
    }

    return (
        <nav className="flex space-x-8 font-instrument-sans font-bold">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-[#08162E] text-[20px] font-bold not-italic leading-normal [text-stroke-width:1px] [text-stroke-color:#08162E] font-instrument-sans mx-[40px]"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
}
