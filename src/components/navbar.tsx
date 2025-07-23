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
import { Button } from "@/components/ui/button";
import { CartItem } from "@/types/index";
import { useUser } from "@/context/UserContext";


type HeaderProps = {
  title: string;
};

function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    let price = item.product.basePrice;
    if (item.selectedVariants) {
      price += item.selectedVariants.reduce(
        (vsum, v) => vsum + (v.priceAdjustment || 0),
        0
      );
    }
    return sum + price * item.quantity;
  }, 0);
}

export function Header({ title }: HeaderProps) {
  const totalItems: number = useCartStore(selectTotalItems);
  const items = useCartStore((state) => state.items);
  const subtotal: number = getCartSubtotal(items);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-lg px-4 py-3 shadow-xs border-border/20">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-xl font-bold capitalize">
            {title}
          </Link>

          <div className="hidden sm:block">
            <NavItem
              href="/products"
              label="All Products"
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-6">
          <Link href={"/orders"} prefetch>
            <Button className="rounded-full cursor-pointer transition-transform hover:scale-105 font-medium">
              {user?.name ? user.name.slice(0, 8) : "Sign up"}
              <User2Icon className="ml-2 size-4" />
            </Button>
          </Link>

          <div className="flex items-center group">
            <Sheet>
              <SheetTrigger asChild>
                <div className="flex cursor-pointer justify-center items-center">
                  <div className="relative group cursor-pointer flex">
                    <div className="p-2 rounded-full hover:bg-accent transition-colors">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />{" "}
                    </div>
                    {totalItems > 0 && (
                      <div
                        className="absolute -top-1 -right-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center shadow-[0_0_0_2px] shadow-background"
                        style={{
                          width: "20px",
                          height: "20px",
                          padding: "2px",
                        }}
                      >
                        {totalItems}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground hidden sm:block transition-colors ml-0.5">
                    Cart
                  </span>
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
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total
                        </span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>

                      <div className="mt-4">
                        <SheetClose asChild>
                          <Link
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all font-medium flex items-center justify-center gap-2"
                            href="/checkout"
                          >
                            Proceed to Checkout
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
