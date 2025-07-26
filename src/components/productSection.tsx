import React from "react";
import ProductCard from "./productCard";
import { IProduct } from "@/types/index";
import Link from "next/link";

interface ProductsSectionProps {
  products: IProduct[];
  title?: string;
  subtitle?: string;
}

export default function ProductsSection({
  products,
  title,
  subtitle,
}: ProductsSectionProps) {
  const isDefaultFeatured =
    title === "Featured Products" &&
    subtitle === "Discover our most popular items";

  let displayProducts: IProduct[] = [];
  if (isDefaultFeatured) {
    const featured = products.filter((p) => p.isFeatured);
    if (featured.length >= 8) {
      displayProducts = featured.slice(0, 8);
    } else {
      const nonFeatured = products.filter((p) => !p.isFeatured);
      displayProducts = [
        ...featured,
        ...nonFeatured.slice(0, 8 - featured.length),
      ];
    }
  } else {
    displayProducts = products;
  }

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : isDefaultFeatured ? (
            <div className="col-span-full text-center text-muted-foreground text-lg py-12">
              No featured products yet.
            </div>
          ) : null}
        </div>
        {isDefaultFeatured && (
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary font-semibold underline underline-offset-4 decoration-2 hover:text-primary/80 transition text-base group"
            >
              View All Products
              <span className="inline-block group-hover:translate-x-1 transition-transform text-lg">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
