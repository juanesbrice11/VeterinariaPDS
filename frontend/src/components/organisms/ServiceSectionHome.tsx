'use client';

import ServiceCard from '../molecules/ServiceCard';
import { Dog, Cat, Scissors } from 'lucide-react';
import Button from '../atoms/Button';


export default function ServicesSection() {
  return (
    <section className="text-center py-16 bg-transparent from-orange-50 to-white font-instrument-sans">
      <p className="text-[#FB7B53]  font-bold mb-4 " > Services</p>
      <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
        Our one-stop solution 
        <br />
        for premium petcare
      </h3>

      <div className="flex flex-wrap justify-center gap-8 mb-10">
        <ServiceCard
          icon={'/assets/dogCareService.png'}
          title="Dog care"
          description="Our Dog Care services include grooming, walking, boarding, and training. We ensure your furry friend is happy, healthy."
          bgColor="bg-[#97F597]"
        />
        <ServiceCard
          icon={'/assets/catCareService.png'}
          title="Cat care"
          description="We offer specialized cat care services including grooming, boarding, and in-home visits. Our dedicated team is here for you."
          bgColor="bg-[#FB7B53]"
        />
        <ServiceCard
          icon={'/assets/dogPetGroomingService.png'}
          title="Pet Grooming"
          description="Keep your pets looking their best with full-service grooming. From baths to nail trims, our expert groomers do it all!"
          bgColor="bg-[#67E4FF]"
        />
      </div>

      <Button variant="primary" >
        More Services
      </Button>
    </section>
  );
}
