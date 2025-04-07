'use client';

import { useParams } from 'next/navigation';
import { services, Service } from '@/data/services';

export default function ServiceDetail() {
  const params = useParams();
  const serviceId = params.id as string;
  
  const service = services.find((s: Service) => s.id === serviceId);

  if (!service) {
    return <div>Servicio no encontrado</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={service.icon}
            alt={service.title}
            className="w-32 h-32 mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-lg text-gray-600 mb-8">{service.description}</p>
        </div>
      </div>
    </div>
  );
} 