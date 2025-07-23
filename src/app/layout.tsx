import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Lexend } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import ReactQueryProvider from "@/providers/QueryProvider";
import type { ReactNode } from "react";
import { UserProvider } from "@/context/UserContext";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ethify",
  description:
    "Ethify - Effortlessly build stunning, responsive websites with intuitive tools and seamless deployment.",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={lexend.className} suppressHydrationWarning>
      <body>
        <Toaster />
        <ReactQueryProvider>
          <UserProvider>
            <div className="flex min-h-svh flex-col ">
              {children}
              <Analytics />
            </div>
          </UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
