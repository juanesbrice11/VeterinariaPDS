'use client';

import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

export default function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-semibold shadow-md transition cursor-pointer';
  const variants = {
    primary: 'bg-[#FB7B53] text-white hover:bg-orange-500',
    secondary: 'text-black hover:underline',
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}
