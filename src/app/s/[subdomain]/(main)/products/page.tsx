"use client";

import { useQuery } from '@tanstack/react-query';
import ProductsSection from '@/components/productSection';
import { IProduct } from '@/types/index';

export default function ProductsPage() {
 
  async function getAllProducts() {
    const res = await fetch('/api/product?store=68474b0d1db8b6c73d5935bf');
    return res.json();
  }

  const { data: products, error, isLoading } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <span className="inline-block animate-bounce text-4xl text-indigo-500">. . .</span>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <span className="inline-block animate-pulse text-2xl text-red-500">Something went wrong. Please try again.</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <ProductsSection
          products={products || []}
          title="All Products"
          subtitle="Browse our complete collection"
        />
      </main>
    </div>
  );
}