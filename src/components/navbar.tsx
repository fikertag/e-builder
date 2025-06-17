"use client";

import { UserButton } from "@daveyplate/better-auth-ui";
import CartSheetContent from "./cartList";
import Link from "next/link";
import { Menu,ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavItem } from "./nav-item";
import { authClient } from "@/lib/auth-client";
import { useCartStore, selectTotalItems } from '@/store/cartStore';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartItem } from '@/types/index';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  title: string;
};

function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.basePrice * item.quantity, 0);
}
function getCartTax(subtotal: number) {
  return subtotal * 0.02;
}

export function Header({title} : HeaderProps) {
   const { data: session } = authClient.useSession();
   const totalItems: number = useCartStore(selectTotalItems);
   const items = useCartStore((state) => state.items);
   const subtotal: number = getCartSubtotal(items);
   const tax: number = getCartTax(subtotal);
   const total: number = subtotal + tax;
   const router = useRouter();
  return (
    <header className=" top-0 z-50 border-b border-gray-100 bg-background/20 px-4 py-3 backdrop-blur">
      <div className="container mx-auto grid grid-cols-3 items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="hidden">
              <Sheet>
                <SheetTrigger asChild>
                    <Menu size={17} />
                </SheetTrigger>

                <SheetContent side={"left"}>
                  <SheetHeader className="mt-3">
                    <SheetTitle>
                        {title}
                    </SheetTitle>
                    <Separator className="mt-3" />
                  </SheetHeader>

                  <ul className="flex gap-4 flex-col mx-5 font-medium text-sm">
                    <li>
                      <SheetClose asChild>
                        <NavItem href="/products" label="All Products" />
                      </SheetClose>
                    </li>
                    {/* <li>
                      <SheetClose asChild>
                        <NavItem href="#About" label="About" />
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <NavItem href="#contact" label="Contact" />
                      </SheetClose>
                    </li> */}
                  </ul>

                  <SheetFooter>
                    <div className="flex sm:hidden justify-end">
                      <ModeToggle />
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

          <Link
            href={"/"}
            className="text-xl font-semibold text-center flex items-center justify-center"
          >
            {title}
          </Link>
        </div>
          <ul className="gap-10 flex justify-center font-semibold text-base">  
                        <NavItem href="/products" label="All Products" />
                        {/* <NavItem href="#about" label="About" />
                        <NavItem href="#contact" label="Contact" /> */}
          </ul>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden min-[400px]:flex mx-2 ">
            {/* <ModeToggle /> */}
          </div>
          {session ? <UserButton /> : <Sheet>
                          <SheetTrigger asChild>
                              <Button> <ShoppingCart /> {totalItems}</Button> 
                          </SheetTrigger>
                          <SheetContent side={"right"} className="px-2">
                          <SheetHeader className="mt-3">
                           <SheetTitle >
                            Cart
                           </SheetTitle>
                           </SheetHeader>
                            <CartSheetContent />
                            <SheetFooter>
                                <div className=" text-sm text-neutral-500 dark:text-neutral-400">
            <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
              <p>Subtotal</p>
              <div className="text-right text-base text-black dark:text-white">
                ${subtotal.toFixed(2)}
              </div>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
              <p>Taxes (2%)</p>
              <div className="text-right text-base text-black dark:text-white">
                ${tax.toFixed(2)}
              </div>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
              <p>Shipping</p>
              <p className="text-right">Calculated at checkout</p>
            </div>
            <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
              <p>Total</p>
              <div className="text-right text-base text-black dark:text-white">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
        
                              
                                <SheetClose asChild>
                                   <button
                                     className="w-full rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                     onClick={() => router.push('/checkout')}
                                   >
                                     Checkout
                                   </button>
                                </SheetClose>
                              </SheetFooter>
                          </SheetContent>
                        </Sheet>}
        </div>
      </div>
    </header>
  );
}
