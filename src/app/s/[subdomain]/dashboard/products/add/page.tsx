"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PackagePlus } from "lucide-react";

export default function AddProductPage() {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <PackagePlus className="text-gray-500" />
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
          >
            Add Product
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
