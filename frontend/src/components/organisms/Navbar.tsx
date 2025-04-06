'use client';

import Logo from '../atoms/Logo';
import NavLinks from '../molecules/NavLinks';
import Button from '../atoms/Button';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Navbar() {
  const [hasToken, setHasToken] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  return (
    <header className="bg-orange-50 py-4 px-10 flex justify-between items-center shadow-sm border-b rounded-b-[10px]">
      <Logo />
      <NavLinks />
      <div className="flex items-center">
        {hasToken ? (
          <Button variant="primary" onClick={() => router.push('/profile')}>
            Profile
          </Button>
        ) : (
          <div className="flex space-x-4">
            <Button variant="primary" onClick={() => router.push('/register')}>
              Register
            </Button>
            <Button variant="primary" onClick={() => router.push('/login')}>
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
} 
