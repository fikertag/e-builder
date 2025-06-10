"use client";
import LandingHero from '@/components/landingHero';
import ProductsSection from '@/components/productSection';
import Footer from '@/components/footer';
// import { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {IAIBrandConfig} from '@/model/store';
import {IVariant, ICustomOption} from '@/model/product';
import {
  PackageCheck,
  Star,
  Truck
} from "lucide-react";

import { useStoreData } from "@/store/useStoreData";



interface StoreData {
  _id: string; 
  owner: string; 
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  generatedAt?: string; 
  isPublished: boolean;
}

export interface IProduct  {
 _id: string; // Unique identifier
  store: string; // Reference to Store
  title: string;
  description: string;
  basePrice: number;          // Starting price before variants
  variants: IVariant[];
  categories: string[]; // Reference to Categories
  images: string[];           // Main product images
  isFeatured: boolean;
  isActive: boolean;          // Soft delete
  attributes: {               // Flexible metadata
    [key: string]: string | number | boolean | undefined; // { "gender": "unisex", "weight": "200g" }
  };
  customOptions?: ICustomOption[];
}

// Mock data - replace with real data source
// const featuredProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Premium mug',
//     description: 'Noise-cancelling headphones with premium sound quality',
//     price: 29.99,
//     imageUrl: '/cup.webp',
//     category: 'mugs'
//   },
//   // Add more products as needed
// ];

 export default function Page() {

  const storme = useStoreData((state) => state.store);

  console.log("Store data from Zustand:", storme);

  async function getProducts() {
    const res = await fetch('/api/product?store=68474b0d1db8b6c73d5935bf');
    return res.json();
  }

  async function fetchStore(subdomain: string) {
  const res = await fetch(`/api/store/${subdomain}`);
  return res.json();
}

// const { subdomain } = await params

 const { data: store, error, isLoading } = useQuery<StoreData> ({ 
   queryKey:  ["store"],
   queryFn:() => fetchStore("myshop"),
 });
const { data: products, error: perror, isLoading: pisLoading } = useQuery<IProduct[]> ({ 
   queryKey:  ["products"],
   queryFn:() => getProducts(),
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
        <ProductsSection products={products || []} />


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