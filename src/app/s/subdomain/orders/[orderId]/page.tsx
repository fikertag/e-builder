"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function OrderPaymentPage() {
  const { orderId } = useParams();
  const [method, setMethod] = useState<"telebirr" | "cbe" | "">("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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
    setIsSubmitting(true);

    const formData = new FormData();
    if (!orderId || typeof orderId !== "string") {
      setError("Order ID is missing.");
      setIsSubmitting(false);
      return;
    }
    formData.append("orderId", orderId);
    formData.append("method", method);
    if (transactionId) formData.append("transactionId", transactionId);
    if (screenshot) formData.append("screenshot", screenshot);

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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Submit Payment for Order #{orderId}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as "telebirr" | "cbe")}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select method</option>
            <option value="telebirr">Telebirr</option>
            <option value="cbe">CBE</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Transaction Number</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter transaction/reference number"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Or Upload Payment Screenshot
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}
