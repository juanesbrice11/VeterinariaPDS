'use client'

import React from 'react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-white shadow-inner py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600">&copy; 2024 Veterinaria PDS. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-orange-500">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-orange-500">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
