'use client'
import React from 'react'
import Navbar from '../organisms/Navbar'
import Footer from '../organisms/Footer'

export default function HomeComponent() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%]'>
      <Navbar />
      <main className="flex-grow">
        {/* Aquí irá el contenido principal */}
      </main>
      <Footer />
    </div>
  )
}
