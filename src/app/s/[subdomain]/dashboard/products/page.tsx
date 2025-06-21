"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import Link from "next/link";
import { IProduct } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";
import Image from "next/image";

export default function ProductsPage() {
  const store = useStoreData((state) => state.store);

  async function getProducts() {
    const res = await fetch(`/api/product?store=${store?.id}`);
    return res.json();
  }

  const {
    data: products,
    error,
    isLoading,
  } = useQuery<IProduct[]>({
    queryKey: ["products", store?.id],
    queryFn: () => getProducts(),
    enabled: !!store?.id,
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-gray-500" />
          <CardTitle>Products</CardTitle>
        </div>
        <Link
          href="#"
          className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-500 text-center py-8">
            Loading products...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">
            Failed to load products.
          </div>
        ) : products && products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="py-2 px-3 font-semibold">Image</th>
                  <th className="py-2 px-3 font-semibold">Title</th>
                  <th className="py-2 px-3 font-semibold">Price</th>
                  <th className="py-2 px-3 font-semibold">Status</th>
                  <th className="py-2 px-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-medium">{product.title}</td>
                    <td className="py-2 px-3">${product.basePrice}</td>
                    <td className="py-2 px-3">
                      {product.isActive ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <Link
                        href={`./products/${product._id}`}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No products found. Start by adding a new product.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
