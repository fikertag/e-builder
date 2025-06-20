"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2">
        <ShoppingCart className="text-gray-500" />
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-center py-8">
          No orders yet. Orders will appear here as they are placed.
        </div>
      </CardContent>
    </Card>
  );
}
