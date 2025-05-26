'use client';

import React from 'react';
import Image from 'next/image';
import Button from '../atoms/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  price: string;
  bgColor?: string;
  iconBgColor?: string;
  isSelected?: boolean;
}

export default function ServicePriceCard({
  icon,
  title,
  description,
  price,
  bgColor = 'bg-white',
  iconBgColor = 'bg-yellow-200',
  isSelected = false,
}: ServiceCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleBookNowClick = () => {
    if (isAuthenticated) {
      router.push('/schedule-appointment');
    } else {
      toast('Please log in to schedule your appointments', {
        icon: '📅',
        duration: 3000
      });
      router.push('/login');
    }
  };

  return (
    <div
      className={`flex flex-col items-center text-center p-6 rounded-3xl shadow-md ${bgColor} w-64 h-auto font-instrument-sans relative border ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBgColor} -mt-10 mb-4`}>
        <Image src={icon} alt={title} width={30} height={30} />
      </div>

      <h3 className="text-xl font-bold mb-2 text-[#150B33]">{title}</h3>

      <p className="text-sm text-[#150B33] mb-4">{description}</p>

      <div className="w-full border-t border-gray-300 mb-4" />

      <div className="text-lg font-bold text-[#150B33] mb-4">{price}</div>

      <Button variant="primary" onClick={handleBookNowClick}>
        Book Now
      </Button>
    </div>
  );
}
