import { AppSidebar } from "@/components/app-sidebar";
import type { ReactNode } from "react";
import { StoresInitializer } from "../StoreInitializer";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <StoresInitializer />
      <AppSidebar />
      <SidebarInset className="px-4">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <div
              data-orientation="vertical"
              role="none"
              data-slot="separator-root"
              className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px mr-2 data-[orientation=vertical]:h-4"
            ></div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
