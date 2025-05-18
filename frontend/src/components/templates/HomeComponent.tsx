'use client'
import React from 'react'
import MainHome from '../organisms/MainHome'

export default function HomeComponent() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-white via-white via-[35.1%] to-[#FFE9D2] to-[87.02%]'>
      <main className="flex-grow m-10 p-10">
        <MainHome />
      </main>
    </div>
  )
}
