'use client';
import Link from 'next/link';

export default function NavLinks() {
    const links = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services' },
        { href: '/about', label: 'About' },
    ];

    return (
        <nav className="flex space-x-8 font-instrument-sans font-bold">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-[#08162E] text-[20px] font- not-italic leading-normal [text-stroke-width:1px] [text-stroke-color:#08162E] font-instrument-sans mx-[40px]"
                >
                    {link.label}
                </Link>

            ))}
        </nav>
    );
}
