"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { IProduct } from "@/types/index";
import { useState, useMemo, useEffect } from "react";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [customOptionValues, setCustomOptionValues] = useState<
    Record<string, string>
  >({});
  const [mainImage, setMainImage] = useState<string>("");

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

  // Helper to get selected variant object
  const variantObj = product?.variants?.find((v) => v.sku === selectedVariant);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1, variantObj ? [variantObj] : [], customOptionValues);
  };

  // Group variants by type (e.g., size, color)
  const variantGroups = useMemo(() => {
    if (!product?.variants) return {};
    const groups: Record<string, IProduct["variants"]> = {};
    product.variants.forEach((v) => {
      const type = v.type || "Other";
      if (!groups[type]) groups[type] = [];
      groups[type].push(v);
    });
    return groups;
  }, [product]);

  // All images: product images + variant images (unique)
  const allImages = useMemo(() => {
    if (!product) return [];
    const imgs = [...product.images];
    product.variants?.forEach((v) => {
      if (v.image && !imgs.includes(v.image)) imgs.push(v.image);
    });
    return imgs;
  }, [product]);

  // Set main image on load or when variant changes
  useEffect(() => {
    if (selectedVariant) {
      const v = product?.variants?.find((v) => v.sku === selectedVariant);
      if (v?.image) setMainImage(v.image);
      else setMainImage(product?.images[0] || "/placeholder.png");
    } else {
      setMainImage(product?.images[0] || "/placeholder.png");
    }
  }, [selectedVariant, product]);

  // When clicking a thumbnail, update main image and select variant if image matches
  const handleThumbnailClick = (img: string) => {
    setMainImage(img);
    // If this image is a variant image, select that variant
    const v = product?.variants?.find((v) => v.image === img);
    if (v) setSelectedVariant(v.sku);
  };

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
            src={mainImage || product.images[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        {allImages.length > 1 && (
          <div className="flex gap-2 mt-2">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 rounded overflow-hidden border bg-gray-50 cursor-pointer ${mainImage === img ? "ring-2 ring-indigo-500" : ""}`}
                onClick={() => handleThumbnailClick(img)}
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
        {/* Grouped Variants */}
        {Object.keys(variantGroups).length > 0 && (
          <div className="mb-4 space-y-2">
            {Object.entries(variantGroups).map(([type, variants]) => (
              <div key={type}>
                <div className="font-semibold mb-1 capitalize">
                  Select {type}:
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.sku}
                      type="button"
                      className={`px-3 py-1 rounded text-sm border transition-all flex items-center gap-2 ${selectedVariant === v.sku ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-100 border"}`}
                      onClick={() => setSelectedVariant(v.sku)}
                    >
                      {v.image && (
                        <span className="inline-block w-5 h-5 relative">
                          <Image
                            src={v.image}
                            alt={v.name}
                            fill
                            className="object-contain rounded"
                          />
                        </span>
                      )}
                      {v.name}{" "}
                      {v.priceAdjustment ? `(+${v.priceAdjustment})` : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Custom Options */}
        {product.customOptions && product.customOptions.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-1">Custom Options:</div>
            <form className="space-y-2">
              {product.customOptions.map((opt, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium mb-1">
                    {opt.name}{" "}
                    {opt.required && <span className="text-red-500">*</span>}
                  </label>
                  {opt.type === "dropdown" ? (
                    <select
                      className="w-full border rounded px-2 py-1"
                      required={opt.required}
                      value={customOptionValues[opt.name] || ""}
                      onChange={(e) =>
                        setCustomOptionValues((prev) => ({
                          ...prev,
                          [opt.name]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select...</option>
                      {opt.choices?.map((choice) => (
                        <option key={choice} value={choice}>
                          {choice}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      required={opt.required}
                      value={customOptionValues[opt.name] || ""}
                      onChange={(e) =>
                        setCustomOptionValues((prev) => ({
                          ...prev,
                          [opt.name]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              ))}
            </form>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-lg shadow-md cursor-pointer font-semibold hover:opacity-80 active:scale-95 transition-all duration-200 mt-4"
          disabled={
            (product.variants &&
              product.variants.length > 0 &&
              !selectedVariant) ||
            (product.customOptions &&
              product.customOptions.some(
                (opt) => opt.required && !customOptionValues[opt.name]
              ))
          }
        >
          <ShoppingCart size={20} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
