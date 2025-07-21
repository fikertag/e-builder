"use client";

import { ShoppingCart, Package, BarChart2, Store } from "lucide-react";
import Link from "next/link";
import { useStoreData } from "@/store/useStoreData";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);

  // Fetch product count
  const { data: productsData } = useQuery({
    queryKey: ["products", store?.id],
    queryFn: async () => {
      if (!store?.id) return [];
      const res = await fetch(`/api/product?store=${store.id}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!store?.id,
  });

  // Fetch order stats
  const { data: orderStats } = useQuery({
    queryKey: ["order-stats", store?.id],
    queryFn: async () => {
      if (!store?.id) return null;
      const res = await fetch(`/api/order/stats?store=${store.id}`);
      if (!res.ok) throw new Error("Failed to fetch order stats");
      return res.json();
    },
    enabled: !!store?.id,
  });

  const stats = [
    {
      label: "Products",
      value: productsData ? productsData.length : "-",
      icon: <Package className="text-gray-500" />,
    },
    {
      label: "Orders",
      value: orderStats ? orderStats.totalOrders : "-",
      icon: <ShoppingCart className="text-gray-500" />,
    },
    {
      label: "Revenue",
      value: orderStats ? `$${orderStats.totalRevenue}` : "-",
      icon: <BarChart2 className="text-gray-500" />,
    },
    // {
    //   label: "Visitors",
    //   value: 340, // TODO: Replace with real visitor data if available
    //   icon: <Store className="text-gray-500" />,
    // },
  ];

  const recentOrders = orderStats?.recentOrders || [];

  type RecentOrder = {
    _id: string;
    status: string;
    total: number;
  };

  return (
    <div className="w-full  px-6 pb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {store?.storeName}
          </h1>
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
            <span className="font-medium">Subdomain:</span>
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">
              {store?.subdomain}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Status:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
              {store?.isPublished ? "Published" : "Unpublished"}
            </span>
          </div>
          <Link
            href={`https://${store?.subdomain}.fikiryilkal.me`}
            target="_blank"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="inline-block"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 3h7v7m0 0L10 21l-7-7 11-11z"
              />
            </svg>
            Preview Store
          </Link>
        </div>
        <div className="flex gap-2">
          <Link
            href="dashboard/products/add"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
          >
            Add Product
          </Link>
          <Link
            href="dashboard/orders"
            className="px-4 py-2 rounded bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
          >
            View Orders
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow p-5 flex flex-col items-center"
          >
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow px-6 pt-6 pb-2 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ShoppingCart /> Recent Orders
        </h2>
        {recentOrders.length === 0 ? (
          <div className="text-gray-400 italic">No recent orders.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentOrders.map((order: RecentOrder) => (
              <li
                key={order._id}
                className="py-3 flex items-center justify-between"
              >
                <span className="text-gray-700 font-medium">
                  Order #{order._id}
                </span>
                <span className="text-xs text-gray-500">{order.status}</span>
                <span className="text-xs text-gray-500">${order.total}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
