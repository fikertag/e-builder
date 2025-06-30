"use client";

import React from "react";
import Image from "next/image";
import { IProduct } from "@/types/index";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group flex flex-col mb-2">
      <Link
        href={`/products/${product._id}`}
        className="block"
        prefetch={false}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center cursor-pointer">
          <Image
            src={
              product.images[0].startsWith("http")
                ? product.images[0]
                : "/placeholder.png"
            }
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            priority
          />
          {product.isFeatured && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full  ring-2 ring-white">
              Featured
            </span>
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
            <h3 className="font-bold text-lg truncate" title={product.title}>
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-indigo-600 text-xl">
              ${product.basePrice.toFixed(2)}
            </span>
            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-gray-400">
                + {product.variants.length} variant
                {product.variants.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm line-clamp-2 mb-2">
            {product.description}
          </p>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 mt-2 ">
              {product.images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 bg-gray-50"
                >
                  <Image
                    src={img}
                    alt={product.title + " thumbnail " + (idx + 2)}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className=" flex flex-col gap-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {product.updatedAt &&
              Date.now() - new Date(product.updatedAt as string).getTime() <
                1000 * 60 * 60 * 24 * 7 && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-md">
                  New
                </span>
              )}
            {product.isActive === true && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-md">
                Inactive
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-2.5 rounded-lg shadow-md cursor-pointer font-semibold hover:opacity-80 active:scale-95 transition-all duration-200"
          >
            <ShoppingCart size={18} />
            {hasVariantsOrOptions ? "Select Options" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
