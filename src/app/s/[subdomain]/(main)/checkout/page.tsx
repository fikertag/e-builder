'use client'; // Converts to Client Component for interactivity

import { LockIcon, ShieldCheckIcon } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Fetch clientSecret from backend
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 1000, currency: 'usd' }) // TODO: Replace with real cart total
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const options = clientSecret ? {
    clientSecret,
    appearance: { theme: 'stripe' as const },
    fields: {
      billingDetails: {
        name: 'auto',
        email: 'auto',
        address: 'auto',
      },
    },
  } : undefined;

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>

      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm mt-8">
        <div className="flex items-center space-x-2">
          <LockIcon className="w-4 h-4" />
          <span>Secure checkout</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Guarantee</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        By placing your order, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  );
}