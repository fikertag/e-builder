"use client";

import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useMemo } from "react";
import { useStoreData } from "@/store/useStoreData";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";

export default function CheckoutForm() {
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const store = useStoreData((state) => state.store);
  const { user } = useUser();
  const router = useRouter();
  // Shipping method and info state
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'delivery'>('pickup');
  // Delivery locations and price
  const deliveryLocations = useMemo(() => {
    // Store-level delivery locations (array of { location, price })
    if (!store?.deliveryFees) return [];
    return store.deliveryFees.map((fee: any) => ({
      location: fee.location,
      price: fee.price,
    }));
  }, [store]);

  // Default to store minimum delivery fee/location
  const defaultDelivery = useMemo(() => {
    if (!deliveryLocations.length) return { location: "", price: 0 };
    return deliveryLocations.reduce((min, curr) =>
      curr.price < min.price ? curr : min
    );
  }, [deliveryLocations]);

  const [deliveryLocation, setDeliveryLocation] = useState(defaultDelivery.location);
  const [deliveryPrice, setDeliveryPrice] = useState(defaultDelivery.price);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Use store delivery price only
  const effectiveDeliveryPrice = shippingMethod === "delivery"
    ? (Number(deliveryPrice) || 0)
    : 0;

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
    mutationFn: async (orderPayload: any) => {
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
      router.push(`/orders/${order._id}/payment`);
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
    if (!store?.id) {
      setError("Store not found.");
      return;
    }
    // Validate required fields
    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }
    if (shippingMethod === "delivery") {
      if (!deliveryLocation) {
        setError("Please select a delivery location.");
        return;
      }
      if (effectiveDeliveryPrice < 0) {
        setError("Invalid delivery price.");
        return;
      }
    }
    setIsSubmitting(true);
    // Prepare order payload
    const orderPayload: any = {
      store: store.id,
      customer: user?.id || undefined,
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
      shipping: effectiveDeliveryPrice,
      tax: 0,
      total: total + effectiveDeliveryPrice,
      status: "pending",
      shippingMethod,
      phoneNumber,
    };
    if (shippingMethod === "delivery") {
      orderPayload.deliveryLocation = deliveryLocation;
      orderPayload.deliveryPrice = effectiveDeliveryPrice;
    }
    orderMutation.mutate(orderPayload);
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-5 bg-card rounded-xl shadow p-5 md:p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-12"
      >
        {/* Cart Items - Left */}
        <div className="flex-1 border-r border-border md:pr-12 mb-8 md:mb-0 min-w-[350px]">
          <h2 className="text-lg font-semibold mb-2 text-card-foreground">
            Your Cart
          </h2>
          {cartItems.length === 0 ? (
            <div className="text-muted-foreground italic">
              Your cart is empty.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 py-3">
                  <Image
                    src={
                      // Show variant image if available, else main product image
                      item.selectedVariants &&
                      item.selectedVariants.length > 0 &&
                      item.selectedVariants[0].image
                        ? item.selectedVariants[0].image
                        : item.product.images[0]?.startsWith("http")
                          ? item.product.images[0]
                          : "/placeholder.png"
                    }
                    alt={item.product.title}
                    width={48}
                    height={48}
                    className="rounded border border-border object-cover w-12 h-12"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-card-foreground">
                      {item.product.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </div>
                    {item.selectedVariants &&
                      item.selectedVariants.length > 0 && (
                        <div className="text-xs text-muted-foreground/70">
                          {item.selectedVariants.map((v) => v.name).join(", ")}
                        </div>
                      )}
                  </div>
                  <div className="font-bold text-card-foreground">
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
          {/* Shipping Method & Info */}
          <div className="space-y-2 mb-4">
            <h2 className="text-lg font-semibold mb-2 text-card-foreground">
              Shipping Method
            </h2>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="pickup"
                  checked={shippingMethod === "pickup"}
                  onChange={() => setShippingMethod("pickup")}
                />
                Pickup
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="delivery"
                  checked={shippingMethod === "delivery"}
                  onChange={() => setShippingMethod("delivery")}
                />
                Delivery
              </label>
            </div>
            {shippingMethod === "delivery" && (
              <>
                <select
                  className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
                  value={deliveryLocation}
                  onChange={e => {
                    setDeliveryLocation(e.target.value);
                    const found = deliveryLocations.find(l => l.location === e.target.value);
                    setDeliveryPrice(found ? found.price : 0);
                  }}
                  required
                >
                  <option value="" disabled>
                    Select Delivery Location
                  </option>
                  {deliveryLocations.map((loc, idx) => (
                    <option key={idx} value={loc.location}>
                      {loc.location} (${loc.price})
                    </option>
                  ))}
                </select>
                <div className="text-sm font-medium mt-1">
                  Delivery Fee: ${effectiveDeliveryPrice.toFixed(2)}
                </div>
              </>
            )}
            <input
              type="text"
              className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          {/* Subtotal, Delivery, Total */}
          <div className="border-b border-border pb-4 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-card-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-semibold text-card-foreground">
                ${shippingMethod === "delivery" ? effectiveDeliveryPrice.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
              <span className="font-semibold text-lg text-card-foreground">
                Total
              </span>
              <span className="text-xl font-bold text-primary">
                ${(total + (shippingMethod === "delivery" ? effectiveDeliveryPrice : 0)).toFixed(2)}
              </span>
            </div>
          </div>
          {error && (
            <div className="text-destructive text-sm mb-2">{error}</div>
          )}
          {success && (
            <div className="text-accent-foreground text-sm mb-2">{success}</div>
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
