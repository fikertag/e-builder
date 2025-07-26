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
      else setMainImage(product?.images[0] || "/placeholder.webp");
    } else {
      setMainImage(product?.images[0] || "/placeholder.webp");
    }
  }, [selectedVariant, product]);

  // When clicking a thumbnail, update main image and select variant if image matches
  const handleThumbnailClick = (img: string) => {
    setMainImage(img);
    // If this image is a variant image, select that variant
    const v = product?.variants?.find((v) => v.image === img);
    if (v) setSelectedVariant(v.sku);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">Loading...</div>
    );
  if (error || !product)
    return (
      <div className="p-8 text-center text-destructive">Product not found.</div>
    );

  return (
    <div className="container mx-auto my-8 bg-card rounded-xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 justify-center items-center">
      {/* Images */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-80 h-80 bg-muted rounded-lg overflow-hidden">
          <Image
            src={
              mainImage && mainImage.startsWith("http")
                ? mainImage
                : product.images[0]?.startsWith("http")
                  ? product.images[0]
                  : "/placeholder.webp"
            }
            alt={product.title}
            fill
            className="object-contain"
            priority
          />
        </div>
        {allImages.length > 1 && (
          <div className="flex  justify-center flex-wrap gap-2 mt-2">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative w-16 h-16 rounded overflow-hidden border bg-muted cursor-pointer ${mainImage === img ? "ring-2 ring-primary" : "border-border"}`}
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
        <h1 className="text-3xl font-bold mb-2 text-card-foreground">
          <span>{product.title}</span>
        </h1>
        <div className="text-xl text-primary font-semibold mb-2">
          ETB{" "}
          {selectedVariant && variantObj && variantObj.priceAdjustment
            ? `$${(product.basePrice + variantObj.priceAdjustment).toFixed(2)}`
            : `$${product.basePrice.toFixed(2)}`}
        </div>
        <div
          style={{ wordBreak: "break-word" }}
          className="text-muted-foreground mb-4"
        >
          {product.description}
        </div>
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
                      className={`px-3 py-1 rounded text-sm border transition-all flex items-center gap-2 ${selectedVariant === v.sku ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border hover:bg-muted/80"}`}
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
                  <label className="block text-sm font-medium mb-1 text-card-foreground">
                    {opt.name}{" "}
                    {opt.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </label>
                  {opt.type === "dropdown" ? (
                    <select
                      className="w-full border border-border rounded px-2 py-1 bg-background text-foreground"
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
                      className="w-full border border-border rounded px-2 py-1 bg-background text-foreground"
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
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-md cursor-pointer font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200 mt-4 max-w-80 disabled:opacity-50 disabled:cursor-not-allowed"
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
