'use client'
import React from 'react'
import Navbar from '../organisms/Navbar'
import Footer from '../organisms/Footer'
import MainService from '../organisms/MainService'

export default function ServiceComponent() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-[#FFE9D2] via-white to-[#CBEFB5]'>
      <Navbar />

      <main className="flex-grow m-10 p-10">
        <MainService />
      </main>

      <Footer />
    </div>
  )
}
