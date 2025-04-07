import React from 'react'
import Image from 'next/image'
import Button from '../atoms/Button'
import ServiceSectionServices from './ServicesSectionServices'

export default function MainService() {
    return (
        <div>
            <div className='flex flex-col md:flex-row items-center justify-center px-4 md:px-10 py-10 gap-40'>
                <div className='flex flex-col justify-center font-otomanopee text-[#08162E] text-base md:text-[20px] font-normal not-italic leading-normal text-center md:text-left'>

                    <h2 className='text-[#08162E] text-4xl md:text-[72px] font-bold font-otomanopee not-italic leading-tight mb-4'>
                        <p>Services</p>
                    </h2>
                </div>

                <div className='flex justify-center items-center'>
                    <Image
                        src="/assets/DogService.png"
                        alt="Fluffy Paws Logo"
                        width={600}
                        height={600}
                        className='w-full max-w-md md:max-w-lg h-auto object-contain'
                    />
                </div>


            </div>

            <ServiceSectionServices />

        </div>
    )
}
