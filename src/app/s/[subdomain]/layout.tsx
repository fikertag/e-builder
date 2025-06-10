import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/navbar';
import { StoreData } from '@/types';
import StoreInitializer from './StoreInitializer';

async function getStoreBySubdomain(subdomain: string): Promise<StoreData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  console.log(`Fetching store for subdomain: ${subdomain} from ${baseUrl}/api/store/${subdomain}`);
  const res = await fetch(`${baseUrl}/api/store/${subdomain}`);
  console.log(`Response status: ${res.status}`);
  if (!res.ok) return null;
  const data = await res.json();
  console.log(`Fetched store data:`, data);
  return data as StoreData;
}

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { subdomain: string };
}) {
 const { subdomain } = await params
  const store = await getStoreBySubdomain(subdomain);
  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <CartProvider>
      <Header title={store.storeName} />
      <StoreInitializer store={store} />
      {children}
    </CartProvider>
  );
}