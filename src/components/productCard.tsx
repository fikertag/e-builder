"use client";

import React from "react";
import Image from "next/image";
import { IProduct } from "@/types/index";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();
  const hasVariantsOrOptions =
    (product.variants && product.variants.length > 0) ||
    (product.customOptions && product.customOptions.length > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVariantsOrOptions) {
      router.push(`/products/${product._id}`);
    } else {
      addToCart(product, 1, [], {});
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border group flex flex-col mb-2">
      <Link
        href={`/products/${product._id}`}
        className="block"
        prefetch={false}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-48 bg-muted flex items-center justify-center cursor-pointer">
          <Image
            src={
              product.images[0].startsWith("http")
                ? product.images[0]
                : "/placeholder.png"
            }
            alt={product.title}
            fill
            className="object-contain transition-transform duration-300"
            priority
          />
          {product.isFeatured && (
            <Badge className="absolute top-1 right-1 ">Featured</Badge>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col justify-between gap-4 flex-1">
        <div className="flex flex-col gap-2 flex-1">
          <Link
            href={`/products/${product._id}`}
            className="hover:underline"
            prefetch={false}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-bold text-lg truncate text-card-foreground"
              title={product.title}
            >
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-primary text-xl">
              ${product.basePrice.toFixed(2)}
            </span>
            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-muted-foreground">
                + {product.variants.length} variant
                {product.variants.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
            {product.description}
          </p>
        </div>
        <div className=" flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 mb-1">
            {product.updatedAt &&
              Date.now() - new Date(product.updatedAt as string).getTime() <
                1000 * 60 * 60 * 24 * 7 && (
                <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-md">
                  New
                </span>
              )}

            <Badge variant={"secondary"}>Hot</Badge>
            <Badge variant={"secondary"}>Free delivery</Badge>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg shadow-md cursor-pointer font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200"
          >
            <ShoppingCart size={18} />
            {hasVariantsOrOptions ? "Select Options" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
