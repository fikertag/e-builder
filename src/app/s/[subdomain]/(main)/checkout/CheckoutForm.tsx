"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useStoreData } from "@/store/useStoreData";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const paymentOptions = [
  { label: "Telebirr", value: "telebirr", logo: "/telebirr.png" },
  { label: "CBE", value: "cbe", logo: "/cbe.png" },
];

export default function CheckoutForm() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const store = useStoreData((state) => state.store);
  const router = useRouter();
  // Shipping address state
  const [shipping, setShipping] = useState({
    city: "",
    street: "",
    phone: "",
  });
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const total = cartItems.reduce((sum, item) => {
    let price = item.product.basePrice;
    if (item.selectedVariants) {
      price += item.selectedVariants.reduce(
        (vsum, v) => vsum + (v.priceAdjustment || 0),
        0
      );
    }
    return sum + price * item.quantity;
  }, 0);

  const orderMutation = useMutation({
    mutationFn: async (orderPayload: {
      store: string;
      customer: string;
      items: Array<{
        product: string;
        variant?: string;
        quantity: number;
        price: number;
      }>;
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
      status: string;
      shippingAddress: typeof shipping;
      stripePaymentId: string;
      stripeChargeId: string;
      paymentMethod: string;
    }) => {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          typeof err.message === "string"
            ? err.message
            : "Failed to create order"
        );
      }
      return res.json();
    },
    onSuccess: (order) => {
      clearCart();
      router.push(
        `/checkout/payment?orderId=${order._id}&method=${selectedPayment}`
      );
    },
    onError: () => {
      setError("Failed to place order. Please try again.");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedPayment) {
      setError("Please select a payment method.");
      return;
    }
    if (!store?.id) {
      setError("Store not found.");
      return;
    }
    // Validate shipping address
    for (const key of ["city", "street", "phone"]) {
      if (!shipping[key as keyof typeof shipping]) {
        setError("Please fill in all shipping address fields.");
        return;
      }
    }
    setIsSubmitting(true);
    // Prepare order payload
    const orderPayload = {
      store: store.id,
      customer: "6651d200b5b50e504b6eba5b", // TODO: Replace with real customer ObjectId
      items: cartItems.map((item) => ({
        product: item.product._id,
        variant: item.selectedVariants?.map((v) => v.sku).join(", "),
        quantity: item.quantity,
        price:
          item.product.basePrice +
          (item.selectedVariants
            ? item.selectedVariants.reduce(
                (sum, v) => sum + (v.priceAdjustment || 0),
                0
              )
            : 0),
      })),
      subtotal: total,
      shipping: 0,
      tax: 0,
      total: total,
      status: "pending",
      shippingAddress: shipping,
      stripePaymentId: "",
      stripeChargeId: "",
      paymentMethod: selectedPayment,
    };
    orderMutation.mutate(orderPayload);
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-5 bg-white rounded-xl shadow p-5 md:p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-12"
      >
        {/* Cart Items - Left */}
        <div className="flex-1 border-r md:pr-12 mb-8 md:mb-0 min-w-[350px]">
          <h2 className="text-lg font-semibold mb-2">Your Cart</h2>
          {cartItems.length === 0 ? (
            <div className="text-gray-400 italic">Your cart is empty.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 py-3">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={48}
                    height={48}
                    className="rounded border object-cover w-12 h-12"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.product.title}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </div>
                    {item.selectedVariants && item.selectedVariants.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {item.selectedVariants.map((v) => v.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-gray-900">
                    $
                    {item.product.basePrice +
                      (item.selectedVariants
                        ? item.selectedVariants.reduce(
                            (sum: number, v) => sum + (v.priceAdjustment || 0),
                            0
                          )
                        : 0)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Total, Address, Payment - Right */}
        <div className="w-full md:w-[420px] flex-shrink-0">
          {/* Shipping Address */}
          <div className="space-y-2 mb-4">
            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="City"
              value={shipping.city}
              onChange={(e) =>
                setShipping((s) => ({ ...s, city: e.target.value }))
              }
              required
            />
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Street"
              value={shipping.street}
              onChange={(e) =>
                setShipping((s) => ({ ...s, street: e.target.value }))
              }
              required
            />
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Phone Number"
              value={shipping.phone || ""}
              onChange={(e) =>
                setShipping((s) => ({ ...s, phone: e.target.value }))
              }
              required
            />
          </div>
          {/* Subtotal, Delivery, Total */}
          <div className="border-b pb-4 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Delivery</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="font-semibold text-lg">Total</span>
              <span className="text-xl font-bold text-green-700">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
          {/* Payment Method */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <div className="flex gap-4">
              {paymentOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`border rounded-lg px-1 py-1 flex flex-col items-center gap-1 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedPayment === opt.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => setSelectedPayment(opt.value)}
                >
                  <Image
                    src={opt.logo}
                    alt={opt.label}
                    objectFit="cover"
                    height={64}
                    width={64}
                  />
                </button>
              ))}
            </div>
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm mb-2">{success}</div>
          )}
          <Button
            type="submit"
            className="w-full text-lg py-3 mt-2"
            disabled={cartItems.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Pay & Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
