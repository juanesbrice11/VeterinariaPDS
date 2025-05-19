'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUsers, 
  FaUserTie, 
  FaPaw, 
  FaCalendarAlt, 
  FaCogs 
} from 'react-icons/fa';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/profile', icon: <FaUsers className="w-5 h-5" /> },
  { name: 'Users', path: '/profile/users', icon: <FaUsers className="w-5 h-5" /> },
  { name: 'Employees', path: '/profile/employees', icon: <FaUserTie className="w-5 h-5" /> },
  { name: 'Pets', path: '/profile/pets', icon: <FaPaw className="w-5 h-5" /> },
  { name: 'Appointments', path: '/profile/appointments', icon: <FaCalendarAlt className="w-5 h-5" /> },
  { name: 'Services', path: '/profile/services', icon: <FaCogs className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 border-r border-gray-200 sticky top-0 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-orange-600 mb-8">Admin Panel</h2>
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