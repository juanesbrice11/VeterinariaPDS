import Image from 'next/image';
import React from 'react';

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Image src="/assets/logo.png" alt="Fluffy Paws Logo" width={80} height={80} />
    </div>
  );
}
