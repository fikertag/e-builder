"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react"; // Add this at the top if you have lucide-react or use any icon library
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-indigo-600">${product.price.toFixed(2)}</span>
         <button
  onClick={() => addToCart(product)}
  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
>
  <ShoppingCart size={18} />
  Add to Cart
</button>
        </div>
      </div>
    </div>
  );
}
