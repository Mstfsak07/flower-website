"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { Noto_Serif } from "next/font/google";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/lib/locale";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const copy = {
  tr: {
    confirmPassword: "Şifre Tekrar",
    contact: "İletişim",
    copyright: "© 2024 Midnight Conservatory. Tüm Hakları Saklıdır.",
    email: "E-posta Adresi",
    error: "Kayıt başarısız.",
    fullName: "Ad Soyad",
    login: "Giriş Yap",
    password: "Şifre",
    phone: "Telefon",
    phonePlaceholder: "Telefon (İsteğe bağlı)",
    privacy: "Gizlilik Politikası",
    register: "Kayıt Ol",
    registering: "Hesap Oluşturuluyor",
    sales: "Mesafeli Satış Sözleşmesi",
    subtitle: "Hesabını oluştur, oturumun otomatik açılsın ve buketlerini daha hızlı yönet.",
    title: "Kayıt Ol",
    hasAccount: "Zaten hesabın var mı?",
  },
  en: {
    confirmPassword: "Confirm Password",
    contact: "Contact",
    copyright: "© 2024 Midnight Conservatory. All Rights Reserved.",
    email: "Email Address",
    error: "Registration failed.",
    fullName: "Full Name",
    login: "Sign In",
    password: "Password",
    phone: "Phone",
    phonePlaceholder: "Phone (Optional)",
    privacy: "Privacy Policy",
    register: "Create Account",
    registering: "Creating Account",
    sales: "Distance Sales Agreement",
    subtitle: "Create your account, sign in automatically, and manage your bouquets faster.",
    title: "Create Account",
    hasAccount: "Already have an account?",
  },
} as const;

export function RegisterForm({ locale = "tr" }: { locale?: Locale }) {
  const t = copy[locale];
  const { register } = useAuth();
  const [form, setForm] = useState({
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({
        ...form,
        phone: form.phone.trim() ? form.phone : undefined,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#131313] font-[var(--font-sans)] text-[#e5e2e1] selection:bg-[#f2ca50] selection:text-[#3c2f00]">
      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-6 py-12">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
          <img
            alt="Close-up of deep obsidian dark roses with golden metallic leaves under soft moonlight with moody atmospheric lighting"
            className="absolute -bottom-20 -left-20 w-[600px] rotate-12"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADwaxSjOTGA24vdqo9peuG6mU_Lku5FPbOOR1SrsApQtagpK2mko5owG7ZgCkNCR227YirHoujPzPOsOUvnYF6jEpijMpWJTvmf17-Il3Wn8M7eKdMP_3sSb-zf4Mb7Lqt67p69R0X8l0_1MHCEg6OfMMS5QuTB65GhwhK8Tj-XaXnbfDm9k51PSFLdG8D3UPfPdF9XrjsfrotPrEkYuxZXpwM9564H1A66jeux8aOuxEV6kpjQ4Jo7g2tdmFM4uBphjrVG4ndjB-H"
          />
          <img
            alt="High-end editorial photography of exotic midnight flowers with golden pollen glinting in shadows on a black background"
            className="absolute -right-20 -top-20 w-[500px] -rotate-12"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKB3GqHRetZdLpjPr-GNQEdlSB_qtSPdFWne3Q3e9ChhBSm4ra7r4j3eVuYJXZ_LWVObwLP6ov1bldax2lfBX7CVGvgl_YymBso6I6PHJzP3idlbTkLox9cPSYvw1PSycwo5qSSe8KCrnxIwy4UDz254GcgDQtgIv7li33jqabznpaT6nWBeFDuwQrQj69sd1Flp419pnhb_yLPSFD5idNHz2UyUZNEEEo9fg3tWeRz_rogyAeKxNnFcqg6MWnI2IEqoHFLpLrKdQj"
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="group relative overflow-hidden rounded-xl bg-[#1c1b1b] p-10 shadow-[0_40px_60px_-10px_rgba(0,0,0,0.4)] md:p-12">
            <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-b from-[#f2ca50]/10 to-transparent opacity-50" />
            <div className="relative z-10">
              <h1 className={`${notoSerif.className} mb-2 text-4xl tracking-tight text-[#e5e2e1]`}>{t.title}</h1>
              <p className="mb-10 text-sm text-[#d0c5af]">
                {t.subtitle}
              </p>

              {error ? (
                <div className="mb-6 rounded-md border border-[#93000a] bg-[#93000a]/20 px-4 py-3 text-sm text-[#ffdad6]">
                  {error}
                </div>
              ) : null}

              <form className="space-y-8" noValidate onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#d0c5af]">{t.fullName}</label>
                  <input
                    autoComplete="name"
                    className="w-full rounded-md border border-[rgba(77,70,53,0.2)] bg-[#353534] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/30 focus:border-[#f2ca50]/50 focus:outline-none transition-all"
                    disabled={isLoading}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder={t.fullName}
                    value={form.name}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#d0c5af]">{t.email}</label>
                  <input
                    autoComplete="email"
                    className="w-full rounded-md border border-[rgba(77,70,53,0.2)] bg-[#353534] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/30 focus:border-[#f2ca50]/50 focus:outline-none transition-all"
                    disabled={isLoading}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="ornek@lumina.com"
                    type="email"
                    value={form.email}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-[0.1em] text-[#d0c5af]">{t.phone}</label>
                  <input
                    autoComplete="tel"
                    className="w-full rounded-md border border-[rgba(77,70,53,0.2)] bg-[#353534] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/30 focus:border-[#f2ca50]/50 focus:outline-none transition-all"
                    disabled={isLoading}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder={t.phonePlaceholder}
                    value={form.phone}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#d0c5af]">{t.password}</label>
                    <input
                      autoComplete="new-password"
                      className="w-full rounded-md border border-[rgba(77,70,53,0.2)] bg-[#353534] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/30 focus:border-[#f2ca50]/50 focus:outline-none transition-all"
                      disabled={isLoading}
                      onChange={(event) => updateField("password", event.target.value)}
                      placeholder="••••••••"
                      type="password"
                      value={form.password}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-[0.1em] text-[#d0c5af]">{t.confirmPassword}</label>
                    <input
                      autoComplete="new-password"
                      className="w-full rounded-md border border-[rgba(77,70,53,0.2)] bg-[#353534] px-4 py-3.5 text-sm text-[#e5e2e1] placeholder:text-[#d0c5af]/30 focus:border-[#f2ca50]/50 focus:outline-none transition-all"
                      disabled={isLoading}
                      onChange={(event) => updateField("confirmPassword", event.target.value)}
                      placeholder="••••••••"
                      type="password"
                      value={form.confirmPassword}
                    />
                  </div>
                </div>

                <button
                  className="w-full rounded-md bg-[linear-gradient(135deg,#F2CA50_0%,#D4AF37_100%)] py-4 text-sm font-bold uppercase tracking-[0.15em] text-[#3c2f00] shadow-lg shadow-[#f2ca50]/10 transition-all hover:shadow-[#f2ca50]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.registering}
                    </span>
                  ) : (
                    t.register
                  )}
                </button>
              </form>

              <div className="mt-10 border-t border-[#99907c]/10 pt-8 text-center">
                <p className="text-sm text-[#d0c5af]">
                  {t.hasAccount}
                  <Link
                    className="ml-1 font-medium text-[#f2ca50] decoration-[#f2ca50]/30 underline-offset-4 hover:underline"
                    href="/giris"
                    prefetch={false}
                  >
                    {t.login}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 opacity-40">
            <img
              alt="Ultra close-up of a single 24k gold leaf with intricate veins on a dark velvet surface"
              className="h-full w-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyl-a2Jy3pdaTZxgrYWnlrgLCZc7G_2S04uG8VURDG-putd1h9g9634-WvEy0IjZxxy4vUoamcMJNEJgLa0Yx_7WQWD2hHGEMKWrZqrwBwQyu4xyy1N6GzMk8R3aWw7s_p4BgX3k_pJAfO1qPzvHQbHWXwR-W7YcOzJv3oN9wcX6dgViBAESqkGZNd8WVpJjhlO7O55khoxcEoy5AfNzXKV8C9GTTMXTy7cYjC2DUAbAkheI8Qnq69VNVK4qwGfKKO8BHFnvxUI47F"
            />
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-[#0e0e0e] py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-12 md:flex-row">
          <div className={`${notoSerif.className} text-lg text-[#f2ca50]`}>Midnight Conservatory</div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link className="text-sm uppercase tracking-widest text-[#e5e2e1]/60 transition-all hover:text-[#f2ca50]" href="/gizlilik-politikasi" prefetch={false}>
              {t.privacy}
            </Link>
            <Link className="text-sm uppercase tracking-widest text-[#e5e2e1]/60 transition-all hover:text-[#f2ca50]" href="/mesafeli-satis-sozlesmesi" prefetch={false}>
              {t.sales}
            </Link>
            <Link className="text-sm uppercase tracking-widest text-[#e5e2e1]/60 transition-all hover:text-[#f2ca50]" href="/iletisim" prefetch={false}>
              {t.contact}
            </Link>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-[#e5e2e1]/40">
            {t.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
