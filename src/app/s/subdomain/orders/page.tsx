"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/customer-auth-client";
import { Button } from "@/components/ui/button";

const STATUSES = [
  { key: "pending", label: "Pending" },
  { key: "shipping", label: "Shipping" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

const fetchUserOrders = async (userId: string) => {
  const res = await fetch(`/api/order/user/${userId}`);
  if (res.status === 404) {
    return [];
  }
  const data = await res.json();
  return data.orders;
};

type UserOrder = {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    product:
      | {
          title?: string;
          _id: string;
          basePrice?: number;
          variants?: { name: string; sku: string }[];
          images?: string[];
        }
      | string;
    variant?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  payment?: string;
  shippingMethod: "pickup" | "delivery";
  deliveryLocation?: string;
  deliveryPrice?: number;
  phoneNumber: string;
  store?: string;
  customer?: string;
};

export default function OrdersPage() {
  const { data, isPending } = authClient.useSession();
  const userId = data?.user?.id || "";
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const router = useRouter();
  const [showDetail, setShowDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState<UserOrder | null>(null);

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => fetchUserOrders(userId),
    enabled: !!userId,
  });

  if (!userId && !isPending) {
    router.replace("/auth/signup");
  }
  if (isLoading)
    return (
      <div className="w-full flex justify-center mt-10 text-muted-foreground">
        Loading orders...
      </div>
    );
  if (isError)
    return <div className="text-muted-foreground">No orders found.</div>;
  if (!orders || orders.length === 0)
    return <div className="text-muted-foreground">No orders found.</div>;

  // Merge paid and shipping as "shipping"
  const normalizedOrders = (orders as UserOrder[]).map((order) => ({
    ...order,
    status:
      order.status === "paid" || order.status === "shipping"
        ? "shipping"
        : order.status,
  }));

  // Get unique statuses present in user's orders
  const presentStatuses = Array.from(
    new Set(normalizedOrders.map((order) => order.status))
  );

  // Count for each status
  const statusCounts: Record<string, number> = {};
  presentStatuses.forEach((status) => {
    statusCounts[status] = normalizedOrders.filter(
      (order) => order.status === status
    ).length;
  });

  const filteredOrders = selectedStatus
    ? normalizedOrders.filter((order) => order.status === selectedStatus)
    : normalizedOrders;

  const handlePay = (orderId: string) => {
    router.push(`/orders/${orderId}/payment`);
  };

  const handleCancel = async (orderId: string) => {
    try {
      const res = await fetch("/api/order/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled.");
        window.location.reload();
      } else {
        alert(data.error || "Failed to cancel order.");
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleConfirmReceived = async (orderId: string) => {
    try {
      const res = await fetch("/api/order/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "confirm" }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order marked as delivered.");
        window.location.reload();
      } else {
        alert(data.error || "Failed to confirm received.");
      }
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <div className="p-2 sm:p-5">
      {/* User Info Header */}
      <div className="flex flex-row items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
          <h2 className="text-2xl  text-foreground capitalize">
            {data?.user?.name ?? "User"}
          </h2>
          <div className="text-muted-foreground text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {data?.user?.realEmail ?? "N/A"}
          </div>
        </div>
        <Button
          variant={"destructive"}
          size={"sm"}
          onClick={() => {
            if (window.confirm("Are you sure you want to log out?")) {
              authClient.signOut();
            }
          }}
        >
          Sign Out
        </Button>
      </div>
      {/* Status navbar */}
      <nav className="flex gap-4 sm:gap-8 border-b border-border mb-6">
        <div
          className={`cursor-pointer pb-2 sm:text-base text-sm font-medium transition-all ${
            selectedStatus === ""
              ? "border-b-2 border-primary text-primary font-bold"
              : "text-muted-foreground hover:text-primary"
          }`}
          onClick={() => setSelectedStatus("")}
        >
          All{" "}
          <span className="ml-1 text-xs text-muted-foreground">
            {normalizedOrders.length}
          </span>
        </div>
        {presentStatuses.map((statusKey) => {
          // Find label from STATUSES
          const statusObj = STATUSES.find((s) => s.key === statusKey);
          if (!statusObj) return null;
          return (
            <div
              key={statusObj.key}
              className={`cursor-pointer pb-2 sm:text-base text-sm font-medium transition-all ${
                selectedStatus === statusObj.key
                  ? "border-b-2 border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setSelectedStatus(statusObj.key)}
            >
              {statusObj.label}
              <span className="ml-1 text-xs text-muted-foreground">
                {statusCounts[statusObj.key]}
              </span>
            </div>
          );
        })}
      </nav>
      <ul className="space-y-4">
        {filteredOrders.map((order) => (
          <li
            key={order._id}
            className="border border-border rounded-xl p-4 shadow bg-card flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="font-semibold text-card-foreground text-sm sm:text-base">
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
                  <button
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 text-xs font-semibold"
                    onClick={() => {
                      setDetailOrder(order);
                      setShowDetail(true);
                    }}
                  >
                    Detail
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
              {order.status !== "pending" && order.status !== "shipping" && (
                <button
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 text-xs font-semibold"
                  onClick={() => {
                    setDetailOrder(order);
                    setShowDetail(true);
                  }}
                >
                  Detail
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Detail Modal */}
      {showDetail && detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60">
          <div className="bg-card rounded-xl shadow-lg p-6 min-w-[350px] max-w-[95vw] relative">
            <button
              className="absolute top-2 right-2 text-lg font-bold text-muted-foreground hover:text-destructive"
              onClick={() => setShowDetail(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-card-foreground">
              Order Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Order ID:</span>{" "}
                {detailOrder._id}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {detailOrder.status}
              </div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(detailOrder.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {detailOrder.phoneNumber}
              </div>
              <div>
                <span className="font-semibold">Shipping Method:</span>{" "}
                {detailOrder.shippingMethod}
              </div>
              {detailOrder.shippingMethod === "delivery" && (
                <div>
                  <span className="font-semibold">Delivery Location:</span>{" "}
                  {detailOrder.deliveryLocation || "-"}
                </div>
              )}
              {detailOrder.deliveryPrice !== undefined && (
                <div>
                  <span className="font-semibold">Delivery Price:</span>{" "}
                  {detailOrder.deliveryPrice}
                </div>
              )}
              <div>
                <span className="font-semibold">Subtotal:</span>{" "}
                {detailOrder.subtotal}
              </div>
              <div>
                <span className="font-semibold">Shipping:</span>{" "}
                {detailOrder.shipping}
              </div>
              <div>
                <span className="font-semibold">Tax:</span> {detailOrder.tax}
              </div>
              <div>
                <span className="font-semibold">Total:</span>{" "}
                {detailOrder.total}
              </div>
              <div className="mt-4">
                <span className="font-semibold">Items:</span>
                <ul className="mt-2 space-y-2">
                  {detailOrder.items?.map((item, idx) => (
                    <li key={idx} className="border rounded p-2 bg-muted/30">
                      <div>
                        <span className="font-semibold">Product:</span>{" "}
                        {typeof item.product === "string"
                          ? item.product
                          : item.product.title || item.product._id}
                      </div>
                      {item.variant && (
                        <div>
                          <span className="font-semibold">Variant:</span>{" "}
                          {item.variant}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Quantity:</span>{" "}
                        {item.quantity}
                      </div>
                      <div>
                        <span className="font-semibold">Price:</span>{" "}
                        {item.price}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
