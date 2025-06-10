"use client";
import LandingHero from '@/components/landingHero';
import ProductsSection from '@/components/productSection';
import Footer from '@/components/footer';
import { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {IAIBrandConfig} from '@/model/store';
import {
  PackageCheck,
  Star,
  Truck
} from "lucide-react";


export interface StoreData {
  _id: string; 
  owner: string; 
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  generatedAt?: string; 
  isPublished: boolean;
}



// Mock data - replace with real data source
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium mug',
    description: 'Noise-cancelling headphones with premium sound quality',
    price: 29.99,
    imageUrl: '/cup.webp',
    category: 'mugs'
  },
  {
    id: '2',
    name: 'Classic White Mug',
    description: 'A timeless white mug perfect for your morning coffee or tea.',
    price: 14.99,
    imageUrl: '/mug.jpg',
    category: 'mugs'
  },
  {
    id: '3',
    name: 'Jogging Mug',
    description: 'Stay hydrated on the go with this stylish jogging mug.',
    price: 16.99,
    imageUrl: '/jog.avif',
    category: 'mugs'
  },
  {
    id: '4',
    name: 'Purple Ceramic Mug',
    description: 'Add a splash of color to your kitchen with this purple ceramic mug.',
    price: 15.99,
    imageUrl: '/purplemug.jpg',
    category: 'mugs'
  },
  {
    id: '5',
    name: 'Blue Mug',
    description: 'Enjoy your favorite drinks in this cool blue mug.',
    price: 15.99,
    imageUrl: '/bluemug.webp',
    category: 'mugs'
  },
  {
    id: '6',
    name: 'Black Travel Mug',
    description: 'A sleek black mug designed for travel and everyday use.',
    price: 18.99,
    imageUrl: '/blackmug.avif',
    category: 'mugs'
  },
  // Add more products as needed
];


 export default function Page() {
  async function fetchStore(subdomain: string) {
  const res = await fetch(`/api/store/${subdomain}`);
  return res.json();
}
// const { subdomain } = await params

 const { data: store, error, isLoading } = useQuery<StoreData> ({ 
   queryKey:  ["store"],
   queryFn:() => fetchStore("myshop"),
 });

 if (isLoading) {
   return <div>Loading...</div>;
 }

 if (error) {
   return <div>Error loading store data</div>; 
 }
 

  return (
   <>
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
      <LandingHero
         title={store?.storeName || ""}
         description={store?.description || ""}
         imageUrl="/mug.jpg"
       />
        <ProductsSection products={featuredProducts} />



    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Why MugLife?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          At MugLife, we blend craftsmanship, creativity, and quality to bring you the perfect mug for every moment.
        </p>

        <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <Star className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              Durable, dishwasher-safe mugs made with love and the best ceramic.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <PackageCheck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Unique Designs</h3>
            <p className="text-sm text-gray-600">
              Custom artwork and fun prints that express your vibe — no boring mugs here.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <Truck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">Fast Shipping</h3>
            <p className="text-sm text-gray-600">
              Get your mugs delivered quickly with eco-friendly packaging and care.
            </p>
          </div>
        </div>
      </div>
    </section>



      </main>
      <Footer />
    </div>
    </>
  );
}