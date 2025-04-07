'use client';

import Logo from '../atoms/Logo';
import NavLinks from '../molecules/NavLinks';
import Button from '../atoms/Button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-orange-50 py-4 px-6 md:px-10 flex items-center justify-between shadow-sm border-b rounded-b-[10px] relative">
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Logo />
      </div>

      {/* Center: NavLinks */}
      <div className="hidden md:flex justify-center flex-1">
        <NavLinks />
      </div>

      {/* Right: Buttons */}
      <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
        {hasToken ? (
          <Button variant="primary" onClick={() => router.push('/profile')}>
            Profile
          </Button>
        ) : (
          <>
            <Button variant="primary" onClick={() => router.push('/register')}>
              Register
            </Button>
            <Button variant="primary" onClick={() => router.push('/login')}>
              Login
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden text-[#FB7B53]">
        <button onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-orange-50 shadow-md rounded-b-[10px] p-4 flex flex-col items-center space-y-4 md:hidden z-50 text-center">
          <NavLinks />
          {hasToken ? (
            <Button fullWidth variant="primary" onClick={() => router.push('/profile')}>
              Profile
            </Button>
          ) : (
            <>
              <Button fullWidth variant="primary" onClick={() => router.push('/register')}>
                Register
              </Button>
              <Button fullWidth variant="primary" onClick={() => router.push('/login')}>
                Login
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
