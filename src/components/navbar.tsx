'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar({BrandName}: { BrandName: string }) {
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">{BrandName}</Link>
      </div>
      
      <div className="flex items-center space-x-6">
        <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">Home</Link>
        <Link href="/products" className="text-gray-700 hover:text-indigo-600 transition">Products</Link>
        <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition">About</Link>
        <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</Link>
        
        <div className="relative">
          <Link href="/cart" className="text-gray-700 hover:text-indigo-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}