'use client';

import React from 'react';

export type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
};

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  fullWidth = false, 
  type = 'button', 
  className = '',
  disabled = false 
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-semibold shadow-md transition cursor-pointer';
  const variants = {
    primary: 'bg-[#FB7B53] text-white hover:bg-orange-500',
    secondary: 'text-black hover:underline',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
