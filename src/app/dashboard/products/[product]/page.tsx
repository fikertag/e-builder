"use client";

import { useQuery } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import type { IProduct } from "@/types/index";

export default function ProductDetailPage() {
  const { product: productId } = useParams();
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);

  const {
    data: product,
    error,
    isLoading,
  } = useQuery<IProduct | null>({
    queryKey: ["product", productId, store?.id],
    queryFn: async () => {
      if (!productId || !store?.id) return null;
      const res = await fetch(`/api/product/${productId}?store=${store.id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
    enabled: !!productId && !!store?.id,
  });

  console.log(!!productId && !!store?.id, "productId:", productId, "storeId:", store?.id);

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto mt-8">
        <CardContent className="text-center py-8 text-gray-500">
          Loading product details...
        </CardContent>
      </Card>
    );
  }

  if (error || !product) {
    console.error("Failed to load product:", error, "productId:", productId);
    return (
      <Card className="w-full max-w-xl mx-auto mt-8">
        <CardContent className="text-center py-8 text-red-500">
          Failed to load product details.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto mb-8">
      <CardHeader className="flex items-center gap-2">
        <CardTitle>{product.title}</CardTitle>
        <span className="ml-auto text-xs text-gray-400">{product._id}</span>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            {product.images &&
            product.images.length > 0 &&
            product.images[0] &&
            product.images[0].startsWith("http") ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                width={160}
                height={160}
                className="rounded border object-cover w-40 h-40"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded border">
                No image
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-lg font-semibold">{product.title}</div>
            <div className="text-gray-700 break-all">{product.description}</div>
            <div className="text-gray-900 font-bold text-xl mt-2">
              ${product.basePrice}
            </div>
            <div className="text-sm text-gray-500">
              Status:{" "}
              {product.isActive ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-gray-400">Inactive</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Featured:{" "}
              {product.isFeatured ? (
                <span className="text-blue-600 font-semibold">Yes</span>
              ) : (
                <span className="text-gray-400">No</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Categories:{" "}
              {Array.isArray(product.categories) && product.categories.length > 0
                ? product.categories.join(", ")
                : "None"}
            </div>
            <div className="text-sm text-gray-500">
              Images:
              <div className="flex gap-2 mt-1 flex-wrap">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img: string, idx: number) =>
                    img && img.startsWith("http") ? (
                      <Image
                        key={img + idx}
                        src={img}
                        alt={product.title + " image " + (idx + 1)}
                        width={48}
                        height={48}
                        className="rounded border object-cover w-12 h-12"
                      />
                    ) : null
                  )
                ) : (
                  <span className="text-gray-400 ml-2">No images</span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Attributes:
              <pre className="bg-gray-100 rounded p-2 text-xs mt-1 overflow-x-auto">
                {product.attributes
                  ? JSON.stringify(product.attributes, null, 2)
                  : "None"}
              </pre>
            </div>
            <div className="text-sm text-gray-500">
              Variants:
              {product.variants && product.variants.length > 0 ? (
                <ul className="list-disc ml-5 mt-1">
                  {product.variants.map((variant, idx) => (
                    <li key={variant.sku + idx} className="mb-1">
                      <span className="font-semibold">{variant.name}</span> (
                      {variant.type || "-"}) | SKU: {variant.sku} | Price Adj: $
                      {variant.priceAdjustment ?? 0} | Inventory:{" "}
                      {variant.inventory}{" "}
                      {variant.image && variant.image.startsWith("http") && (
                        <Image
                          src={variant.image}
                          alt={variant.sku}
                          width={32}
                          height={32}
                          className="inline-block ml-2 rounded border w-8 h-8 object-cover align-middle"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-400">None</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Custom Options:
              {product.customOptions && product.customOptions.length > 0 ? (
                <ul className="list-disc ml-5 mt-1">
                  {product.customOptions.map((opt, idx) => (
                    <li key={opt.name + idx}>
                      <span className="font-semibold">{opt.name}</span> (
                      {opt.type}){opt.required ? " *" : ""}
                      {opt.choices && opt.choices.length > 0 && (
                        <span> | Choices: {opt.choices.join(", ")}</span>
                      )}
                      {typeof opt.priceImpact === "number" &&
                        opt.priceImpact !== 0 && (
                          <span> | Price Impact: ${opt.priceImpact}</span>
                        )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-400">None</span>
              )}
            </div>

            {/* Delivery Fee Info */}
            <div className="text-sm text-gray-500 mt-4">
              Delivery Fee:
              {product.isFreeDelivery ? (
                <span className="ml-2 text-green-600 font-semibold">Free Delivery</span>
              ) : product.useDefaultDeliveryFees ? (
                <span className="ml-2 text-blue-600 font-semibold">Uses Store Default</span>
              ) : product.deliveryFees && product.deliveryFees.length > 0 ? (
                <ul className="list-disc ml-5 mt-1">
                  {product.deliveryFees.map((fee: { location: string; price: number }, idx: number) => (
                    <li key={fee.location + idx}>
                      <span className="font-semibold">{fee.location}</span>: ${fee.price}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 text-gray-400">Not set</span>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Link
                href="/dashboard/products"
                className="text-blue-600 hover:underline text-xs font-medium"
              >
                ← Back to Products
              </Link>
              <Link
                href={`/dashboard/products/${product._id}/edit`}
                className="text-yellow-600 hover:underline text-xs font-medium"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
