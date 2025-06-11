import React from 'react';
import ProductCard from './productCard';
import {IProduct} from '@/types/index'; // Adjust the import path as necessary

interface ProductsSectionProps {
  products: IProduct[];
  title?: string;
  subtitle?: string;
}

export default function ProductsSection({ 
  products, 
  title = "Featured Products", 
  subtitle = "Discover our most popular items"
}: ProductsSectionProps) {
  // If this is the default featured section and there are no products, show a message
  const isDefaultFeatured = title === "Featured Products" && subtitle === "Discover our most popular items";
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : isDefaultFeatured ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">
              No featured products yet.
            </div>
          ) : null}
        </div>
        {isDefaultFeatured && (
          <div className="text-center mt-8">
            <a
              href="/products"
              className="inline-flex items-center gap-2 text-indigo-700 font-semibold underline underline-offset-4 decoration-2 hover:text-indigo-900 transition text-base group"
            >
              View All Products
              <span className="inline-block group-hover:translate-x-1 transition-transform text-lg">→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}