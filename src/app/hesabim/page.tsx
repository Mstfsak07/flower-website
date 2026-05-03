/* eslint-disable @next/next/no-img-element */

import { Mail, Phone, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { ProfileEditor } from "@/components/profile-editor";
import { readAuthSession, refreshSessionUser } from "@/lib/auth-server";
import { getAccountProfileRepo } from "@/lib/repositories/account-repository";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await readAuthSession();
  const currentUser = await refreshSessionUser(session?.user ?? null);

  if (!currentUser?.email) {
    redirect("/giris?redirect=/hesabim");
  }

  const displayName =
    currentUser.name.trim() ||
    currentUser.email
      .split("@")[0]
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const profile = currentUser.id ? await getAccountProfileRepo(currentUser.id) : null;
  const phone = profile?.phone ?? currentUser.phone ?? "Belirtilmedi";
  const birthDate = profile?.birthDate ?? currentUser.birthDate ?? "";
  const memberSince = profile?.createdAt
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(profile.createdAt))
    : "Belirtilmedi";

  return (
    <div className="space-y-16">
      <header className="mb-16">
        <h1 className="font-serif text-5xl leading-tight text-[#f2ca50] md:text-6xl">
          Hello {displayName}
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#d0c5af]">
          Sipariş geçmişini, teslimat adreslerini ve profil bilgilerini sade bir hesap panelinde
          yönetebilirsin.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <section className="space-y-6 lg:col-span-1">
          <div className="group relative overflow-hidden rounded-lg bg-[#1c1b1b] p-8">
            <div className="absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-[#f2ca50]/5 blur-3xl transition-colors group-hover:bg-[#f2ca50]/10" />
            <h2 className="font-serif text-xl text-[#d4af37]">Kişisel Bilgiler</h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4">
                <div className="flex items-center gap-3">
                  <UserRound className="h-4.5 w-4.5 text-[#d4af37]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]/75">Ad Soyad</span>
                </div>
                <p className="mt-3 break-words text-sm font-medium text-[#e5e2e1]">{displayName}</p>
              </div>

              <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4.5 w-4.5 text-[#d4af37]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]/75">E-Posta</span>
                </div>
                <p className="mt-3 break-all text-sm font-medium text-[#e5e2e1]">{currentUser.email}</p>
              </div>

              <div className="rounded-lg border border-[#4d4635]/25 bg-[#201f1f] p-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4.5 w-4.5 text-[#d4af37]" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[#d0c5af]/75">Telefon</span>
                </div>
                <p className="mt-3 text-sm font-medium text-[#e5e2e1]">{phone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#2a2a2a] p-8">
            <h2 className="font-serif text-xl text-[#d4af37]">Membership</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="border border-[#4d4635]/30 bg-[#0e0e0e] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d0c5af]">
                {currentUser.role === "ADMIN" ? "Admin Member" : "Premium Member"}
              </span>
              <span className="border border-[#4d4635]/30 bg-[#0e0e0e] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#d0c5af]">
                Member Since: {memberSince}
              </span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          <div className="flex h-full flex-col overflow-hidden rounded-lg bg-[#1c1b1b]">
            <div className="border-b border-[#4d4635]/20 p-8 md:p-12">
              <h2 className="font-serif text-3xl text-[#f2ca50]">Account Management</h2>
              <p className="max-w-xl text-sm leading-relaxed text-[#d0c5af]">
                Profil bilgilerini ve şifreni ayrı bir sayfaya gitmeden burada doğrudan
                güncelleyebilirsin.
              </p>
            </div>

            <div className="p-8 md:p-12">
              <ProfileEditor
                initialData={{
                  name: displayName,
                  email: currentUser.email,
                  birthDate,
                  phone: profile?.phone ?? currentUser.phone ?? "",
                }}
              />
            </div>
          </div>
        </section>
      </div>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-lg">
          <img
            alt="Luxury Floral"
            className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbjCZs0VnxV2UZmBlzY-db7m9DonwcuQmg4T7yklRsJmdYb_xa0cfbs90hFLV-kqE8Z9ZPPE_QT_9Z20B5UqsehEYeJel7PN9YwORZgdmYWFB2fxVs033ipspRVObj5aC2fmE7JoqTCkM_Y07FAeEwDqYLPVcvpoYg0rWfDkYpliRi6tou5A2l13y-qkda1-VNs9ONJiIjn4DDVsazipLFDzYFvrqus207LLVEbZH7fLGRIjphc3rOB0dxHdV8dGRySn3FtU5XYbXa"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6">
            <p className="font-serif text-xl italic text-[#f2ca50]">Signature Series</p>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden rounded-lg">
          <img
            alt="Exotic Blooms"
            className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNqeBf3sDbRjGSdTQXTE2d3YnS7opZNv_GK31IcJ20IKrSTd64LqDC0hMSirr22iU75KZtCsv0gQJENg2u_ve6r9T-l0LAi2zfrkgPI_CFs2ApZDDsh7LuaQqUjiR3uGyGRAHW-yrOAaSHM0bWLL_FjEcKZowUktDECAXSul_syekd_wb754Ijw9Dp26McKpsmGVYyAVqfZzOxVYl3zdJy1Tdm2FWPawWwPenmDVPh76tnGzBkxYQdaer9ReZ6rrS_uwNHu2UurumY"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6">
            <p className="font-serif text-xl italic text-[#f2ca50]">Night Bloomers</p>
          </div>
        </div>
      </section>
    </div>
  );
}
