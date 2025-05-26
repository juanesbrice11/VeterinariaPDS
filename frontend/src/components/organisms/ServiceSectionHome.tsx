'use client';

import ServiceCard from '../molecules/ServiceCard';
import { Dog, Cat, Scissors } from 'lucide-react';
import Button from '../atoms/Button';
import { services, Service } from '@/data/services';
import { useRouter } from 'next/navigation';

export default function ServicesSection() {
  const router = useRouter();
  const homeServices = services.slice(0, 3); // Tomamos solo los primeros 3 servicios para la página de inicio

  const handleMoreServicesClick = () => {
    router.push('/services');
  };

  return (
    <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
      <p className="text-[#FB7B53]  font-bold mb-4 " > Services</p>
      <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
        Our one-stop solution 
        <br />
        for premium petcare
      </h3>

      <div className="flex flex-wrap justify-center gap-8 mb-10">
        {homeServices.map((service: Service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            icon={service.icon}
            title={service.title}
            description={service.description}
            bgColor={service.bgColor}
          />
        ))}
      </div>

      <Button 
        variant="primary"
        onClick={handleMoreServicesClick}
      >
        More Services
      </Button>
    </section>
  );
}
