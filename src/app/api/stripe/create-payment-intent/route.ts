import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-05-28.basil' });

export async function POST(req: NextRequest) {
  const { amount, currency } = await req.json();

  if (!amount || !currency) {
    return NextResponse.json({ error: 'Missing amount or currency' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency,
      automatic_payment_methods: { enabled: true },
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      // This tells Stripe to require billing address fields
      // (Stripe will prompt for these in Payment Element UI)
      // You can also pass 'receipt_email' if you want to require email
      // receipt_email: 'customer@example.com',
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
