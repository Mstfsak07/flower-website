"use client";

import Script from "next/script";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/lib/locale";

type GoogleCredentialResponse = { credential: string };
type GoogleIdentity = {
  accounts: { id: {
    initialize: (config: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
    renderButton: (element: HTMLElement, config: Record<string, string | number>) => void;
  } };
};

declare global { interface Window { google?: GoogleIdentity } }

export function GoogleSignInButton({ locale }: { locale: Locale }) {
  const container = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const render = useCallback(() => {
    if (!clientId || !container.current || !window.google) return;
    container.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        setLoading(true);
        try { await loginWithGoogle(credential); }
        catch (error) { toast.error(error instanceof Error ? error.message : "Google sign-in failed."); setLoading(false); }
      },
    });
    window.google.accounts.id.renderButton(container.current, {
      type: "standard", theme: "outline", size: "large", shape: "pill",
      text: "continue_with", width: 400, locale,
    });
  }, [clientId, locale, loginWithGoogle]);

  if (!clientId) {
    return <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-800">{locale === "tr" ? "Google girişi için Client ID ayarlanmalı." : "A Google Client ID is required to enable sign-in."}</p>;
  }

  return <div className={loading ? "pointer-events-none opacity-60" : ""}>
    <Script src={`https://accounts.google.com/gsi/client?hl=${locale}`} strategy="afterInteractive" onLoad={render}/>
    <div ref={container} className="flex min-h-11 justify-center"/>
  </div>;
}
