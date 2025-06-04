import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';

export default function SubdomainLayout({ children }: { children: ReactNode }) {
  return (

         <CartProvider>
          {children}
        </CartProvider>

  );
}
