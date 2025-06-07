import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import {Header} from '@/components/navbar';


export default function SubdomainLayout({ children }: { children: ReactNode }) {
  return (

         <CartProvider>
                <Header title = {"xyz"} />
          {children}
        </CartProvider>

  );
}
