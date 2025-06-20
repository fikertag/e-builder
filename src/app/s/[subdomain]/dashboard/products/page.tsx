"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="text-gray-500" />
          <CardTitle>Products</CardTitle>
        </div>
        <Link href="#" className="flex items-center gap-1 px-3 py-1.5 rounded bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-center py-8">No products found. Start by adding a new product.</div>
      </CardContent>
    </Card>
  );
}
