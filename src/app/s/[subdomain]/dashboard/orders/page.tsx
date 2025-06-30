"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";

interface Order {
  _id: string;
  customer?: { name?: string } | string;
  total?: number;
  status: string;
  createdAt?: string;
}

export default function OrdersPage() {
  const store = useStoreData((s) => s.store);
  const storeId = store?.id;

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["orders", storeId],
    queryFn: async () => {
      if (!storeId) return [];
      const res = await fetch(`/api/order?store=${storeId}&limit=50`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!storeId,
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2">
        <ShoppingCart className="text-gray-500" />
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-500 text-center py-8">Loading orders...</div>
        ) : isError ? (
          <div className="text-red-500 text-center py-8">{error?.message || "Failed to load orders."}</div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No orders yet. Orders will appear here as they are placed.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left">Order ID</th>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(orders as Order[]).map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-3 py-2 font-mono">{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-3 py-2">{typeof order.customer === "object" ? order.customer?.name || "-" : order.customer || "-"}</td>
                    <td className="px-3 py-2">{order.total?.toLocaleString() || "-"} ETB</td>
                    <td className="px-3 py-2 capitalize">{order.status}</td>
                    <td className="px-3 py-2">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
