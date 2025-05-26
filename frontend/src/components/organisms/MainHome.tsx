import React from 'react'
import Image from 'next/image'
import Button from '../atoms/Button'
import ServiceSectionHome from './ServiceSectionHome'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function MainHome() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleBookNowClick = () => {
        if (isAuthenticated) {
            router.push('/schedule-appointment');
        } else {
            toast('Please log in to schedule your appointments', {
                icon: '📅',
                duration: 3000
            });
            router.push('/login');
        }
    };

    return (
        <div>
            <div className='flex flex-col md:flex-row items-center justify-center px-4 md:px-10 py-10 gap-10'>
                <div className='flex flex-col justify-center font-instrument-sans text-[#08162E] text-base md:text-[20px] font-normal not-italic leading-normal text-center md:text-left'>
                    <p className='mb-2'>Welcome to Fluffy Paws</p>

                    <h2 className='text-[#08162E] text-4xl md:text-[72px] font-bold font-otomanopee not-italic leading-tight mb-4'>
                        <p>The Best</p>
                        <p>Care for Your</p>
                        <p>Best Friend</p>
                    </h2>

                    <p className='max-w-md mb-10'>
                        At PetPath, we provide exceptional care and services for your pets, including grooming, boarding, and walking. Trust us to ensure your furry friends are happy.
                    </p>

                    <div className='flex justify-center md:justify-start'>
                        <Button 
                            variant='primary'
                            onClick={handleBookNowClick}
                        >
                            <p>Book Now</p>
                        </Button>
                    </div>
                </div>

                <div className='flex justify-center items-center'>
                    <Image
                        src="/assets/imageHome.png"
                        alt="Fluffy Paws Logo"
                        width={600}
                        height={600}
                        className='w-full max-w-md md:max-w-lg h-auto object-contain'
                    />
                </div>
            </div>

            <ServiceSectionHome />
        </div>
    )
}
