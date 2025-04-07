export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

export interface Price {
  icon: string;
  title: string;
  description: string;
  price: string;
  iconBgColor: string;
}

export const services: Service[] = [
  {
    id: 'dog-care',
    icon: '/assets/dogCareService.png',
    title: 'Dog care',
    description: 'Our Dog Care services include grooming, walking, boarding, and training. We ensure your furry friend is happy, healthy.',
    bgColor: 'bg-[#97F597]'
  },
  {
    id: 'cat-care',
    icon: '/assets/catCareService.png',
    title: 'Cat care',
    description: 'We offer specialized cat care services including grooming, boarding, and in-home visits. Our dedicated team is here for you.',
    bgColor: 'bg-[#FB7B53]'
  },
  {
    id: 'pet-grooming',
    icon: '/assets/dogPetGroomingService.png',
    title: 'Pet Grooming',
    description: 'Keep your pets looking their best with full-service grooming. From baths to nail trims, our expert groomers do it all!',
    bgColor: 'bg-[#67E4FF]'
  },
  {
    id: 'veterinary-care',
    icon: '/assets/dogCareService.png',
    title: 'Veterinary care',
    description: 'Ensure your pet\'s health with our expert veterinary care. From routine check-ups to emergency services.',
    bgColor: 'bg-[#FFD15C]'
  },
  {
    id: 'health-treatment',
    icon: '/assets/catCareService.png',
    title: 'Health & Treatment',
    description: 'Ensure your pet\'s well-being with our expert health and treatment services. From regular check-ups to specialized care.',
    bgColor: 'bg-[#FE97C3]'
  },
  {
    id: 'pet-boarding',
    icon: '/assets/dogPetGroomingService.png',
    title: 'Pet Boarding',
    description: 'PetPath offers safe and comfortable overnight boarding with 24/7 care. Our luxurious suites.',
    bgColor: 'bg-[#FFE9D2]'
  }
];

export const prices: Price[] = [
  {
    icon: '/assets/groumingServicePriceCard.png',
    title: 'Grouming service',
    description: 'Pamper your furry friends with our exceptional pet grooming service, leaving them looking and feeling their best.',
    price: '100$',
    iconBgColor: 'bg-[#FFD15C]'
  },
  {
    icon: '/assets/petVaccineServicePriceCard.png',
    title: 'Pet Vaccine',
    description: 'Protect your beloved pet with our pet vaccine safeguarding their health and happiness for a joyful life together.',
    price: '70$',
    iconBgColor: 'bg-[#67E4FF]'
  },
  {
    icon: '/assets/petVisitServicePriceCard.png',
    title: 'Pet Visit',
    description: 'Expert pet care in safe hands. Our pet doctor visit ensures that your furry friend\'s health and happiness is ok.',
    price: '80$',
    iconBgColor: 'bg-[#FE97C3]'
  }
]; 