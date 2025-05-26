'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUser, 
  FaPaw, 
  FaCalendarAlt,
  FaFileMedical 
} from 'react-icons/fa';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Profile', path: '/profile', icon: <FaUser className="w-5 h-5" /> },
  { name: 'Pets', path: '/profile/pets', icon: <FaPaw className="w-5 h-5" /> },
  { name: 'Medical Records', path: '/profile/medical-records', icon: <FaFileMedical className="w-5 h-5" /> },
  { name: 'Appointments', path: '/profile/appointments', icon: <FaCalendarAlt className="w-5 h-5" /> },
];

export default function VetSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 border-r border-gray-200 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-orange-600 mb-8">Vet Panel</h2>
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    pathname === item.path
                      ? 'bg-orange-100 text-orange-600'
                      : 'hover:bg-orange-50 text-gray-700 hover:text-orange-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
} 