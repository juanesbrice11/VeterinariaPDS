'use client';

import React from 'react';

interface ServiceCardProps {
  icon?: string; 
  title: string;
  description: string;
  bgColor?: string;
}

export default function ServiceCard({ icon, title, description, bgColor = 'bg-white' }: ServiceCardProps) {
  return (
    <div className={`flex flex-col items-center text-center p-6 rounded-full shadow-md ${bgColor} w-64 h-64 font-instrument`}>
      {icon && (
        <img
          src={icon}
          alt={title}
          className="w-16 h-16 mb-4 object-contain"
        />
      )}
      <h3 className="text-xl font-bold mb-2 text-[#150B33]">{title}</h3>
      <p className="text-sm text-[#150B33]">{description}</p>
    </div>
  );
}
