import type { ReactNode } from "react";
import { Header } from "@/components/navbar";
import { StoreData } from "@/types";
import DynamicThemeProvider from "./DynamicThemeProvider";
import "@/styles/subdomain.css";
import { Providers } from "./providers";
import { StoreInitializer } from "@/app/StoreInitializer";

async function getStoreBySubdomain(
  subdomain: string
): Promise<StoreData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/store/${subdomain}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data as StoreData;
}

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { subdomain: string };
}) {
  const { subdomain } = await params;
  const store = await getStoreBySubdomain(subdomain);
  if (!store) {
    return <div>Store not found</div>;
  }

  return (
    <>
      <Providers>
        <Header title={store.subdomain} />
        <DynamicThemeProvider colorPalette={store.aiConfig.colorPalette}>
          <StoreInitializer store={store} />
          {children}
        </DynamicThemeProvider>
      </Providers>
    </>
  );
}
