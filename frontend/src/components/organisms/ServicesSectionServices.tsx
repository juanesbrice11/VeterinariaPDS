'use client';

import React, { useEffect, useState } from 'react';
import ServiceCard from '../molecules/ServiceCard';
import ServicePriceCard from '../molecules/ServicePriceCard';
import Image from 'next/image';
import { getServices } from '@/services/OptionServices';
import { Service } from '@/types/schemas';

// Función para dividir el array en chunks de tamaño específico
function chunkArray<T>(array: T[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Mapeo de servicios a imágenes basado en palabras clave
const getServiceImage = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('vaccine') || lowerTitle.includes('vaccination')) {
    return '/assets/petVaccineServicePriceCard.png';
  }
  if (lowerTitle.includes('grooming') || lowerTitle.includes('groom')) {
    return '/assets/groumingServicePriceCard.png';
  }
  if (lowerTitle.includes('visit') || lowerTitle.includes('check')) {
    return '/assets/petVisitServicePriceCard.png';
  }
  if (lowerTitle.includes('dog')) {
    return '/assets/dogCareService.png';
  }
  if (lowerTitle.includes('cat')) {
    return '/assets/catCareService.png';
  }
  if (lowerTitle.includes('veterinary') || lowerTitle.includes('vet')) {
    return '/assets/veterinaryCareService.png';
  }
  if (lowerTitle.includes('health') || lowerTitle.includes('treatment')) {
    return '/assets/health&TreatmentService.png';
  }
  if (lowerTitle.includes('boarding') || lowerTitle.includes('stay')) {
    return '/assets/petBoardingService.png';
  }
  
  return '/assets/dogPetGroomingService.png'; // imagen por defecto
};

// Colores armoniosos para los servicios
const serviceColors = [
  'bg-[#97F597]', // Verde suave
  'bg-[#FB7B53]', // Naranja coral
  'bg-[#67E4FF]', // Azul cielo
  'bg-[#FFD15C]', // Amarillo suave
  'bg-[#FE97C3]', // Rosa suave
  'bg-[#FFE9D2]', // Beige
  'bg-[#B5EAD7]', // Verde menta
  'bg-[#C7CEEA]', // Azul lavanda
  'bg-[#E2F0CB]', // Verde lima
  'bg-[#FFDAC1]', // Melocotón
  'bg-[#C4C4C4]', // Gris claro
  'bg-[#B5EAD7]'  // Verde menta
];

export default function ServicesSectionServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No active session');
          return;
        }

        const response = await getServices(token);
        if (response.success && response.services) {
          setServices(response.services);
        } else {
          setError(response.message || 'Error loading services');
        }
      } catch (err) {
        setError('Error loading services');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </section>
    );
  }

  // Filtrar servicios activos y limitar a 6 para las tarjetas de servicios
  const activeServices = services.filter(service => service.isActive).slice(0, 6);
  
  // Filtrar todos los servicios activos para la sección de precios
  const allActiveServices = services.filter(service => service.isActive);

  return (
    <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
      <p className="text-[#FB7B53] font-bold mb-4">Services</p>
      <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
        Our one-stop solution <br />
        for premium petcare
      </h3>

      {/* Servicios dinámicos en filas de 3 (limitado a 6) */}
      {chunkArray(activeServices, 3).map((group, index) => (
        <div key={index} className="flex flex-wrap justify-center gap-8 mb-10">
          {group.map((service, serviceIndex) => (
            <ServiceCard
              key={service.id}
              id={service.id.toString()}
              icon={getServiceImage(service.title)}
              title={service.title}
              description={service.description}
              bgColor={serviceColors[serviceIndex % serviceColors.length]}
            />
          ))}
        </div>
      ))}

      <Image
        src="/assets/coolDog.png"
        alt="dogGroomingService"
        width={80}
        height={80}
        className="mx-auto"
      />

      <p className="text-[#FB7B53] font-bold mb-4">Our Pricing</p>
      <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
        Dog Grooming <br />
        Services & Pricing
      </h3>

      {/* Precios dinámicos en filas de 3 (todos los servicios) */}
      {chunkArray(allActiveServices, 3).map((group, index) => (
        <div key={index} className="flex flex-wrap justify-center gap-8 mb-10">
          {group.map((service, serviceIndex) => (
            <ServicePriceCard
              key={service.id}
              icon={getServiceImage(service.title)}
              title={service.title}
              description={service.description}
              price={service.price ? `$${service.price}` : 'Contact for price'}
              iconBgColor={serviceColors[serviceIndex % serviceColors.length]}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
