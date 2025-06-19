"use client";

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    const { error } = await stripe.confirmPayment({
      elements, 
      confirmParams: {
        return_url: window.location.origin + '/order/success',
      },
    });
    if (error) setError(error.message || 'Payment failed');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        {loading ? 'Processing...' : 'Pay now'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
