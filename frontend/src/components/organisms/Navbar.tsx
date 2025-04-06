'use client';

import Logo from '../atoms/Logo';
import NavLinks from '../molecules/NavLinks';
import Button from '../atoms/Button';

export default function Navbar() {
  return (
    <header className="bg-orange-50 py-4 px-10 flex justify-between items-center shadow-sm border-b rounded-b-[10px]">
      <Logo />
      <NavLinks />
      <div className="flex items-center space-x-4">
        <button className="text-[#08162E] font-bold cursor-pointer">Sign in</button>
        <Button>Sign up</Button>
      </div>
    </header>
  );
} 
