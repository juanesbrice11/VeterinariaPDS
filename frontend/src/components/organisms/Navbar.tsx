'use client';

import Logo from '@/components/atoms/Logo';
import NavLinks from '@/components/molecules/NavLinks';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-orange-50 py-4 px-6 md:px-10 flex items-center justify-between border-b rounded-b-[10px] relative">

      <div className="flex-shrink-0">
        <Logo />
      </div>

      <div className="hidden md:flex justify-center flex-1">
        <NavLinks />
      </div>

      <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
        {loading ? (
          <div className="h-10"></div>
        ) : isAuthenticated ? (
          <>
            <Button variant="primary" onClick={() => router.push('/profile')}>
              Profile
            </Button>
            <Button fullWidth variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
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

      <div className="md:hidden text-[#FB7B53]">
        <button onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-orange-50 shadow-md p-4 flex flex-col items-center space-y-4 md:hidden z-50 text-center">
          <NavLinks />
          {loading ? (
            <div className="h-10"></div>
          ) : isAuthenticated ? (
            <>
              <Button fullWidth variant="primary" onClick={() => router.push('/profile')}>
                Profile
              </Button>
              <Button fullWidth variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
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
