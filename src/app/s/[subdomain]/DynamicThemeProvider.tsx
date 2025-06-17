"use client";
import { useEffect } from "react";

export default function DynamicThemeProvider({ colorPalette, children }: {
  colorPalette: { primary: string; secondary: string; accent: string };
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!colorPalette) return;
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', colorPalette.primary);
    root.style.setProperty('--brand-secondary', colorPalette.secondary);
    root.style.setProperty('--brand-accent', colorPalette.accent);
    return () => {
      root.style.removeProperty('--brand-primary');
      root.style.removeProperty('--brand-secondary');
      root.style.removeProperty('--brand-accent');
    };
  }, [colorPalette]);
  return <>{children}</>;
}
