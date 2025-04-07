    'use client';

    import ServiceCard from '../molecules/ServiceCard';
    import { Dog, Cat, Scissors } from 'lucide-react';
    import Button from '../atoms/Button';
    import ServicePriceCard from '../molecules/ServicePriceCard';
    import Image from 'next/image';

    export default function ServicesSectionServices() {
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

        <div className="flex flex-wrap justify-center gap-8 mb-10">
            <ServiceCard
            icon={'/assets/dogCareService.png'}
            title="Veterinary care"
            description="Ensure your pet’s health with our expert veterinary care. From routine check-ups to emergency services."
            bgColor="bg-[#FFD15C]"
            />
            <ServiceCard
            icon={'/assets/catCareService.png'}
            title="Health & Treatment"
            description="Ensure your pet’s well-being with our expert health and treatment services. From regular check-ups to specialized care."
            bgColor="bg-[#FE97C3]"
            />
            <ServiceCard
            icon={'/assets/dogPetGroomingService.png'}
            title="Pet Boarding"
            description="PetPath offers safe and comfortable overnight boarding with 24/7 care. Our luxurious suites."
            bgColor="bg-[#FFE9D2]"
            />
        </div>    

        <Image src="/assets/coolDog.png" alt="dogGroomingService" width={80} height={80} className='mx-auto'/>

        <p className="text-[#FB7B53]  font-bold mb-4 " > Our Pricing</p>
        <h3 className="text-4xl font-bold mb-10 text-[#150B33]">
            Dog Grooming 
            <br />
            Services & Pricing
        </h3>

        <div className="flex flex-wrap justify-center gap-8 mb-10">
            <ServicePriceCard
            icon={'/assets/groumingServicePriceCard.png'}
            title="Grouming service"
            description="Pamper your furry friends with our exceptional pet grooming service, leaving them looking and feeling their best."
            price="100$"
            iconBgColor="bg-[#FFD15C]"
            />

            <ServicePriceCard
            icon={'/assets/petVaccineServicePriceCard.png'}
            title="Pet Vaccine"
            description="Protect your beloved pet with our pet vaccine safeguarding their health and happiness for a joyful life together."
            price="70$"
            iconBgColor="bg-[#67E4FF]"
            />

            <ServicePriceCard
            icon={'/assets/petVisitServicePriceCard.png'}
            title="Pet Visit"
            description="Expert pet care in safe hands. Our pet doctor visit ensures that your furry friend's health and happiness is ok."
            price="80$"
            iconBgColor="bg-[#FE97C3]"
            />
            
            
        </div>

        

        </section>


    );
    }
