"use client";

import { useQuery } from "@tanstack/react-query";
import ProductsSection from "@/components/productSection";
import { IProduct } from "@/types/index";
import { useStoreData } from "@/store/useStoreData";

//27-04 18-04

export default function ProductsPage() {
  const store = useStoreData((state) => state.store);

  async function getAllProducts() {
    const res = await fetch(`/api/product?store=${store?.id}`);
    return res.json();
  }

  const {
    data: products,
    error,
    isLoading,
  } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: getAllProducts,
    enabled: !!store?.id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <span className="inline-block animate-bounce text-4xl text-primary">
          . . .
        </span>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="inline-block animate-pulse text-2xl text-destructive">
          Something went wrong. Please try again.
        </span>
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
