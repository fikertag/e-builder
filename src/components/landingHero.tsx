// components/LandingHero.tsx
import React from 'react';
import Link from 'next/link';

export default function LandingHero() {
  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Transform Your Digital Experience
          </h1>
          <p className="text-xl mb-8">
            Premium solutions for modern businesses. Cutting-edge technology with simple interfaces.
          </p>
          <div className="flex space-x-4">
            <Link href="/products" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Now
            </Link>
            <Link href="/about" className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-indigo-600 transition">
              Learn More
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="/hero-image.svg" 
            alt="Digital Experience" 
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}