"use client";
import LandingHero from '@/components/landingHero';
import ProductsSection from '@/components/productSection';
import Footer from '@/components/footer';
import { useQuery } from '@tanstack/react-query';
import {IProduct} from '@/types/index';
import {
  PackageCheck,
  Star,
  Truck
} from "lucide-react";

import { useStoreData } from "@/store/useStoreData";

 export default function Page() {

  const store = useStoreData((state) => state.store);

  async function getProducts() {
    const res = await fetch('/api/product?store=68474b0d1db8b6c73d5935bf');
    return res.json();
  }

const { data: products, error, isLoading } = useQuery<IProduct[]> ({ 
   queryKey:  ["products"],
   queryFn:() => getProducts(),
 });

 if (isLoading) return <div>Loading...</div>;
 if (error) return <div>Error loading products</div>;

 console.log(store, "store data");

return (
   <>
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
      <LandingHero
         title={store?.heroHeading || ""}
         description={store?.heroDescription || ""}
         imageUrl="/mug.jpg"
       />
        <ProductsSection products={products || []} />


    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Why {store?.storeName || "Our Store"}?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          {store?.aboutUs || "Discover what makes us unique!"}
        </p>
        <div className="grid gap-10 grid-cols-1 md:grid-cols-3">
          {Array.isArray(store?.whyChooseUs) && store.whyChooseUs.length > 0 ? (
            store.whyChooseUs.map((reason, idx) => (
              <div key={idx} className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                {/* Optionally use icons for first three reasons, fallback to star */}
                {idx === 0 ? (
                  <Star className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                ) : idx === 1 ? (
                  <PackageCheck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                ) : idx === 2 ? (
                  <Truck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                ) : (
                  <Star className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                )}
                <h3 className="font-semibold text-xl mb-2">{reason}</h3>
              </div>
            ))
          ) : (
            // Fallback: show three default features if none in store
            <>
              <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                <Star className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">
                  Durable, dishwasher-safe mugs made with love and the best ceramic.
                </p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                <PackageCheck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Unique Designs</h3>
                <p className="text-sm text-gray-600">
                  Custom artwork and fun prints that express your vibe — no boring mugs here.
                </p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-lg transition">
                <Truck className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Fast Shipping</h3>
                <p className="text-sm text-gray-600">
                  Get your mugs delivered quickly with eco-friendly packaging and care.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
      </main>
      <Footer />
    </div>
    </>
  );
}