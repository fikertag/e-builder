"use client";

import { UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavItem } from "./nav-item";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type HeaderProps = {
  title: string;
};

export function Header({title} : HeaderProps) {
   const { data: session } = authClient.useSession();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/60 px-4 py-3 backdrop-blur">
      <div className="container mx-auto grid md:grid-cols-3 grid-cols-2 items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
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
                        <NavItem href="/products" label="Products" />
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <NavItem href="#About" label="About" />
                      </SheetClose>
                    </li>
                    <li>
                      <SheetClose asChild>
                        <NavItem href="#contact" label="Contact" />
                      </SheetClose>
                    </li>
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
            className="text-xl font-semibold text-center flex items-center justify-center mb-2"
          >
            {title}
          </Link>
        </div>
          <ul className="hidden gap-10 md:flex justify-center font-semibold text-sm">
                        
                        <NavItem href="/Products" label="Products" /><NavItem href="#about" label="About" />
                        <NavItem href="#contact" label="Contact" />

          </ul>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden min-[400px]:flex mx-2 ">
            <ModeToggle />
          </div>
          {session ? <UserButton /> : <Button> <Link
            href={"/auth/sign-in"}
            className="text-white"
          >
            Sign in
          </Link></Button> }
          
        </div>
      </div>
    </header>
  );
}
