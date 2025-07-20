import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { NavItem } from "./nav-item";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-5 z-50 bg-background/90 shadow px-4 py-2 backdrop-blur container mx-auto rounded-2xl">
      <div className="container mx-auto grid md:grid-cols-3 grid-cols-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Sheet>
              {/* <SheetTrigger asChild>
                <Menu size={17} />
              </SheetTrigger> */}

              <SheetContent side={"left"}>
                <SheetHeader className="mt-3">
                  <SheetTitle className="mt-1">Ethify</SheetTitle>
                  <Separator className="mt-3" />
                </SheetHeader>

                <ul className="flex gap-4 flex-col mx-5 font-medium text-sm">
                  <li>
                    <SheetClose asChild>
                      <NavItem href="#home" label="Home" />
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <NavItem href="#about" label="About" />
                    </SheetClose>
                  </li>
                  <li>
                    <SheetClose asChild>
                      <NavItem href="#Pricing" label="Pricing" />
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

          <div className="flex items-start gap-2">
            <ShoppingBag className="text-primary" />
            <Link
              href="/"
              className="text-xl font-semibold leading-none text-primary mt-1"
            >
              Ethify
            </Link>
          </div>
        </div>
        <ul className="hidden gap-10 md:flex justify-center font-medium ">
          <NavItem href="#home" label="Home" />
          <NavItem href="#about" label="About" />
          <NavItem href="#Pricing" label="Pricing" />
        </ul>
        <div className="flex items-center justify-end gap-4">
          <Link className="hidden min-[465px]:flex" href={"/auth/login"}>Log in</Link>
          <Button asChild className="bg-primary" size={"lg"}>
            <Link href={"/auth/signup"} className="text-white font-semibold">
              Start free trial
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
