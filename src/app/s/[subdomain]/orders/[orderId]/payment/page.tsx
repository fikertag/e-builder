"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard, Image as ImageIcon } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";

export default function OrderPaymentPage() {
  const [method, setMethod] = useState<"telebirr" | "cbe" | "">("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { orderId } = useParams();
  const store = useStoreData((state) => state.store)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("method", method);
    if (transactionId) formData.append("transactionId", transactionId);
    if (screenshot) formData.append("screenshot", screenshot);
    if (store?.id) formData.append("storeId", store.id)

    const res = await fetch("/api/payment/verify", {
      method: "POST",
      body: formData,
    });

    setIsSubmitting(false);
    if (res.ok) {
      setSuccess("Payment submitted! You will be notified after verification.");
    } else {
      setError("Failed to submit payment. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Pay for Order <span className="text-gray-700">#{orderId}</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Payment Method
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`flex-1 flex flex-col items-center border-2 rounded-xl p-4 transition ${
                method === "telebirr"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              } hover:border-blue-400`}
              onClick={() => setMethod("telebirr")}
            >
              <img
                src="/telebirr.png"
                alt="Telebirr"
                className="w-10 h-10 mb-1"
              />
              <span className="font-medium">Telebirr</span>
            </button>
            <button
              type="button"
              className={`flex-1 flex flex-col items-center border-2 rounded-xl p-4 transition ${
                method === "cbe"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-gray-50"
              } hover:border-blue-400`}
              onClick={() => setMethod("cbe")}
            >
              <img src="/cbe.png" alt="CBE" className="w-10 h-10 mb-1" />
              <span className="font-medium">CBE</span>
            </button>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Transaction Number
          </label>
          <div className="relative">
            <CreditCard
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              placeholder="Enter transaction/reference number"
            />
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Or Upload Payment Screenshot
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <ImageIcon className="text-gray-400" size={20} />
            <span className="text-gray-600">Choose file</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
              className="hidden"
            />
            {screenshot && (
              <span className="ml-2 text-xs text-green-700 font-medium">
                {screenshot.name}
              </span>
            )}
          </label>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}
