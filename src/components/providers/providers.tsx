"use client";

import { Toaster } from "sonner";

import { StoreProvider } from "@/components/providers/store-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <Toaster position="top-right" richColors />
    </StoreProvider>
  );
}
