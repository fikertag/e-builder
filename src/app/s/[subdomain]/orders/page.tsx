"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { key: "pending", label: "Pending" },
  { key: "shipping", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
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
  const router = useRouter();

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

  // Merge paid and shipping as "shipping"
  const normalizedOrders = orders.map((order: any) => ({
    ...order,
    status:
      order.status === "paid" || order.status === "shipping"
        ? "shipping"
        : order.status,
  }));

  const filteredOrders = selectedStatus
    ? normalizedOrders.filter((order: any) => order.status === selectedStatus)
    : normalizedOrders;

  const handlePay = (orderId: string) => {
    router.push(`/orders/${orderId}/payment`);
  };

  const handleCancel = async (orderId: string) => {
    // Implement cancel logic here (API call)
    alert("Cancel order " + orderId);
  };

  const handleConfirmReceived = async (orderId: string) => {
    // Implement confirm received logic here (API call)
    alert("Confirm received for order " + orderId);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
      {/* Status navbar */}
      <nav className="flex gap-8 border-b mb-6">
        <div
          className={`cursor-pointer pb-2 text-base font-medium transition-all ${
            selectedStatus === ""
              ? "border-b-2 border-blue-600 text-blue-700 font-bold"
              : "text-gray-600 hover:text-blue-600"
          }`}
          onClick={() => setSelectedStatus("")}
        >
          All
        </div>
        {STATUSES.map((status) => (
          <div
            key={status.key}
            className={`cursor-pointer pb-2 text-base font-medium transition-all ${
              selectedStatus === status.key
                ? "border-b-2 border-blue-600 text-blue-700 font-bold"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setSelectedStatus(status.key)}
          >
            {status.label}
          </div>
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
            <div className="mt-2 md:mt-0 flex flex-col gap-2">
              {/* <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize mb-1 ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "shipping"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "delivered"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {order.status}
              </span> */}
              {order.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold"
                    onClick={() => handlePay(order._id)}
                  >
                    Pay
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {order.status === "shipping" && (
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-semibold"
                  onClick={() => handleConfirmReceived(order._id)}
                >
                  Confirm Received
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
