'use client';

import ServiceCard from '../molecules/ServiceCard';
import ServicePriceCard from '../molecules/ServicePriceCard';
import Image from 'next/image';
import { services, Service, prices, Price } from '@/data/services';

// Función para dividir el array en chunks de tamaño específico
function chunkArray<T>(array: T[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function ServicesSectionServices() {
  return (
    <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
      <p className="text-[#FB7B53] font-bold mb-4">Services</p>
      <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
        Our one-stop solution <br />
        for premium petcare
      </h3>

      {/* Servicios dinámicos en filas de 3 */}
      {chunkArray(services, 3).map((group, index) => (
        <div key={index} className="flex flex-wrap justify-center gap-8 mb-10">
          {group.map((service) => (
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

      {/* Precios dinámicos en filas de 3 */}
      {chunkArray(prices, 3).map((group, index) => (
        <div key={index} className="flex flex-wrap justify-center gap-8 mb-10">
          {group.map((priceCard, idx) => (
            <ServicePriceCard
              key={idx}
              icon={priceCard.icon}
              title={priceCard.title}
              description={priceCard.description}
              price={priceCard.price}
              iconBgColor={priceCard.iconBgColor}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
