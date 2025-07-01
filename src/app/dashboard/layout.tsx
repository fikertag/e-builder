import { AppSidebar } from "@/components/app-sidebar";
import type { ReactNode } from "react";
import { StoresInitializer } from "../StoreInitializer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

async function getUserStores(id: string) {
  if (!id) return [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/store?owner=${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const stores = await getUserStores(session?.user?.id || "");

  console.log("User stores:", stores);

  return (
    <SidebarProvider>
      <StoresInitializer stores={stores} />
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
