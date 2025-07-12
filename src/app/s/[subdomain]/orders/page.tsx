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

  if (!userId)
    return (
      <div className="text-muted-foreground">
        Please log in to view your orders.
      </div>
    );
  if (isLoading)
    return <div className="text-muted-foreground">Loading orders...</div>;
  if (isError)
    return (
      <div className="text-destructive">Error: {(error as Error).message}</div>
    );
  if (!orders || orders.length === 0)
    return <div className="text-muted-foreground">No orders found.</div>;

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
      <h2 className="text-2xl font-bold mb-6 text-foreground">Your Orders</h2>
      {/* Status navbar */}
      <nav className="flex gap-8 border-b border-border mb-6">
        <div
          className={`cursor-pointer pb-2 text-base font-medium transition-all ${
            selectedStatus === ""
              ? "border-b-2 border-primary text-primary font-bold"
              : "text-muted-foreground hover:text-primary"
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
                ? "border-b-2 border-primary text-primary font-bold"
                : "text-muted-foreground hover:text-primary"
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
            className="border border-border rounded-xl p-4 shadow bg-card flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-semibold text-card-foreground">
                Order ID: <span className="text-primary">{order._id}</span>
              </div>
              <div className="text-muted-foreground">
                Total:{" "}
                <span className="font-medium text-card-foreground">
                  {order.total}
                </span>
              </div>
              <div className="text-muted-foreground/70 text-sm">
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
                    className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-xs font-semibold"
                    onClick={() => handlePay(order._id)}
                  >
                    Pay
                  </button>
                  <button
                    className="px-3 py-1 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 text-xs font-semibold"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {order.status === "shipping" && (
                <button
                  className="px-3 py-1 bg-accent text-accent-foreground rounded hover:bg-accent/90 text-xs font-semibold"
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
