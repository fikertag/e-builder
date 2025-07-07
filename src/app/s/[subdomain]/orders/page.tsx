"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

const STATUSES = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const fetchUserOrders = async (userId: string) => {
  const res = await fetch(`/api/order/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders;
};

export default function OrdersPage() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => fetchUserOrders(userId),
    enabled: !!userId,
  });

  if (!userId) return <div>Please log in to view your orders.</div>;
  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;
  if (!orders || orders.length === 0) return <div>No orders found.</div>;

  const filteredOrders = selectedStatus
    ? orders.filter((order: any) => order.status === selectedStatus)
    : orders;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      {/* Status navigation */}
      <nav className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full border ${
            selectedStatus === ""
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
          onClick={() => setSelectedStatus("")}
        >
          All
        </button>
        {STATUSES.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full border capitalize ${
              selectedStatus === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </nav>
      <ul className="space-y-4">
        {filteredOrders.map((order: any) => (
          <li
            key={order._id}
            className="border rounded-xl p-4 shadow bg-white flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-semibold text-gray-800">
                Order ID: <span className="text-blue-700">{order._id}</span>
              </div>
              <div className="text-gray-600">
                Total: <span className="font-medium">{order.total}</span>
              </div>
              <div className="text-gray-500 text-sm">
                Created: {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {order.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
