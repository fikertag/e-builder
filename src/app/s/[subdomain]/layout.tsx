import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/navbar';

export default function SubdomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { subdomain: string };
}) {
  const { subdomain } = params;
  return (
    <CartProvider>
      <Header title={subdomain} />
      {children}
    </CartProvider>
  );
}