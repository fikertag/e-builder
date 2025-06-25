"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { IProduct } from "@/types/index";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<IProduct>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(`/api/product/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!productId,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !product)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto my-8 bg-white rounded-xl shadow p-6 md:p-10 flex flex-col md:flex-row gap-10">
      {/* Images */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="relative w-full h-80 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 mt-2">
            {product.images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded overflow-hidden border bg-gray-50"
              >
                <Image
                  src={img}
                  alt={product.title + " thumb"}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Details */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
        <div className="text-xl text-indigo-700 font-semibold mb-2">
          ${product.basePrice.toFixed(2)}
        </div>
        <div className="text-gray-600 mb-4">{product.description}</div>
        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-1">Variants:</div>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <span
                  key={v.sku}
                  className="px-3 py-1 bg-gray-100 rounded text-sm border"
                >
                  {v.name} {v.priceAdjustment ? `(+${v.priceAdjustment})` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Custom Options */}
        {product.customOptions && product.customOptions.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-1">Custom Options:</div>
            <ul className="list-disc ml-5 text-sm text-gray-700">
              {product.customOptions.map((opt, idx) => (
                <li key={idx}>
                  {opt.name} ({opt.type}) {opt.required ? "*" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => addToCart(product, 1, [], {})}
          className="flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg shadow-md cursor-pointer font-semibold hover:opacity-80 active:scale-95 transition-all duration-200 mt-4"
        >
          <ShoppingCart size={20} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
