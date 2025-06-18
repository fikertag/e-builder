"use client";

import CartSheetContent from "./cartList";
import Link from "next/link";
import { ShoppingCart, User2Icon } from "lucide-react";
import { NavItem } from "./nav-item";
import { useCartStore, selectTotalItems } from "@/store/cartStore";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartItem } from "@/types/index";
import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
};

function getCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.product.basePrice * item.quantity,
    0
  );
}

function getCartTax(subtotal: number) {
  return subtotal * 0.02;
}

export function Header({ title }: HeaderProps) {
  const totalItems: number = useCartStore(selectTotalItems);
  const items = useCartStore((state) => state.items);
  const subtotal: number = getCartSubtotal(items);
  const tax: number = getCartTax(subtotal);
  const total: number = subtotal + tax;
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-10">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 capitalize"
          >
            {title}
          </Link>

          <div>
            <NavItem
              href="/products"
              label="All Products"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-6">
          <div className="flex items-center  cursor-pointer group">
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <User2Icon className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 hidden sm:block transition-colors">
              Account
            </span>
          </div>
          <div className="flex items-center cursor-pointer group">
            <Sheet>
              <SheetTrigger asChild>
                <div className="relative group cursor-pointer flex">
                  <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />{" "}
                  </div>
                  {totalItems > 0 && (
                    <div
                      className="absolute -top-1 -right-1 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center"
                      style={{
                        minWidth: "20px",
                        height: "20px",
                        padding: "2px",
                      }}
                    >
                      {totalItems}
                    </div>
                  )}
                </div>
              </SheetTrigger>

              <SheetContent side={"right"} className="w-full max-w-md p-0">
                <div className="h-full flex flex-col">
                  <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle className="text-lg font-semibold">
                      Your Cart
                    </SheetTitle>
                  </SheetHeader>

                  <CartSheetContent />

                  <SheetFooter className="border-t px-6 py-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taxes (2%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-lg">
                          ${total.toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <SheetClose asChild>
                          <button
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                            onClick={() => router.push("/checkout")}
                          >
                            Proceed to Checkout
                          </button>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 hidden sm:block transition-colors ">
              Cart
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
