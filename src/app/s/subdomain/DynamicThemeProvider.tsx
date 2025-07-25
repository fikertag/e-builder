"use client";
import { useEffect } from "react";
import { useStoreData } from "@/store/useStoreData";

// Accepts a full theme style object (e.g., styles.light or styles.dark)
export default function DynamicThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeStyle = useStoreData((state) => state.store?.theme?.styles?.light);

  useEffect(() => {
    if (!themeStyle) return;
    const root = document.documentElement;
    // Apply each theme variable as a CSS variable
    Object.entries(themeStyle).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    // Cleanup: remove variables on unmount or theme change
    return () => {
      Object.keys(themeStyle).forEach((key) => {
        root.style.removeProperty(`--${key}`);
      });
    };
  }, [themeStyle]);
  return <>{children}</>;
}
