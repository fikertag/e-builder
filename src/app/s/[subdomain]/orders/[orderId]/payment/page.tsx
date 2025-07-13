"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Image as ImageIcon } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";
import { useMutation } from "@tanstack/react-query";

export default function OrderPaymentPage() {
  const [method, setMethod] = useState<"telebirr" | "cbe" | "">("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const store = useStoreData((state) => state.store);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Failed to submit payment. Please try again."
        );
      }
      return res.json();
    },
    onSuccess: () => {
      router.push("/orders");
    },
    onError: (err) => {
      router.push("/orders");
      setError(err.message || "Failed to submit payment. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!method) {
      setError("Please select a payment method.");
      return;
    }
    if (!transactionId && !screenshot) {
      setError("Please provide a transaction number or upload a screenshot.");
      return;
    }
    if (!orderId || typeof orderId !== "string") {
      setError("Order ID is missing.");
      return;
    }
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("method", method);
    if (transactionId) formData.append("transactionId", transactionId);
    if (screenshot) formData.append("screenshot", screenshot);
    if (store?.id) formData.append("storeId", store.id);
    mutation.mutate(formData);
  };

  return (
    <div className=" mx-auto mt-5 bg-card rounded-2xl shadow-lg p-8">
      <h2 className=" text-xl sm:text-2xl font-bold mb-6 text-center text-primary">
        Pay for Order <span className="text-foreground">#{orderId}</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-foreground">
            Payment Method
          </label>
          <div className="flex gap-4 ">
            <button
              type="button"
              className={`w-1/2 max-w-[160px] flex flex-col items-center border-2 rounded-xl p-3 transition text-sm
            ${
              method === "telebirr"
                ? "border-primary bg-primary/10"
                : "border-border bg-muted"
            }
            hover:border-primary`}
              onClick={() => setMethod("telebirr")}
            >
              <img
                src="/telebirr.png"
                alt="Telebirr"
                className="w-8 h-8 mb-1"
              />
              <span className="font-medium text-foreground">Telebirr</span>
            </button>
            <button
              type="button"
              className={`w-1/2 max-w-[160px] flex flex-col items-center border-2 rounded-xl p-3 transition text-sm
            ${
              method === "cbe"
                ? "border-primary bg-primary/10"
                : "border-border bg-muted"
            }
            hover:border-primary`}
              onClick={() => setMethod("cbe")}
            >
              <img src="/cbe.png" alt="CBE" className="w-8 h-8 mb-1" />
              <span className="font-medium text-foreground">CBE</span>
            </button>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-foreground">
            Transaction Number
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-3 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary transition bg-background text-foreground"
              placeholder="Enter transaction/reference number"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-foreground">
            Or Upload Payment Screenshot
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <ImageIcon className="text-muted-foreground" size={20} />
            <span className="text-muted-foreground">Choose file</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="hidden"
            />
            {screenshot && (
              <span className="ml-2 text-xs text-success font-medium">
                {screenshot.name}
              </span>
            )}
          </label>
        </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-lg shadow hover:bg-primary/90 transition"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}
