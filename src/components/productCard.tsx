"use client";

import React from "react";
import Image from "next/image";
import {IProduct} from "@/types/index"; // Adjust the import path as necessary
import { ShoppingCart } from "lucide-react"; // Add this at the top if you have lucide-react or use any icon library
// import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-100 group flex flex-col mb-2">
      <div className="relative w-full h-48 bg-gray-50 flex items-center justify-center">
        <Image
          src={product.images[0] || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          priority
        />
        {product.isFeatured && (
          <span className="absolute top-2 left-2 bg-yellow-300 text-xs font-bold px-2 py-1 rounded-full text-indigo-700 shadow">Featured</span>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between gap-4 flex-1">
     
        <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-bold text-lg truncate" title={product.title}>{product.title}</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-indigo-600 text-xl">${product.basePrice.toFixed(2)}</span>
          {product.variants && product.variants.length > 0 && (
            <span className="text-xs text-gray-400">+ {product.variants.length} variant{product.variants.length > 1 ? "s" : ""}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
        {/* Thumbnails for additional images */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-4 mt-2 ">
            {product.images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="relative w-10 h-10 rounded overflow-hidden border border-gray-200 bg-gray-50">
                <Image
                  src={img}
                  alt={product.title + ' thumbnail ' + (idx + 2)}
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
          {product.updatedAt && (Date.now() - new Date(product.updatedAt as string).getTime() < 1000 * 60 * 60 * 24 * 7) && (
  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-md">New</span>
)}
          {product.isActive === true && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-md">Inactive</span>
          )}
        </div>
        <button
          // onClick={() => addToCart(product)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer w-full"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
         </div>
      
      </div>
    </div>
  );
}
