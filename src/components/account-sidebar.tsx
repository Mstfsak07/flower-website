"use client";

import { usePathname } from "next/navigation";
import { User, MapPin, Package, LogOut, Store } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import type { Locale } from "@/lib/locale";

type AccountSidebarProps = {
  locale?: Locale;
  userName: string;
  userEmail: string;
  userRole?: "CUSTOMER" | "ADMIN";
};

const copy = {
  tr: {
    adminMember: "Admin Member",
    links: [
      { href: "/hesabim", label: "Account", icon: User },
      { href: "/hesabim/siparisler", label: "Orders", icon: Package },
      { href: "/hesabim/adresler", label: "Addresses", icon: MapPin },
    ],
    logout: "Sign Out",
    profile: "Account",
    shop: "Shop",
    luxuryMember: "Premium Member",
    order: "Orders",
  },
  en: {
    adminMember: "Admin Member",
    links: [
      { href: "/hesabim", label: "Account", icon: User },
      { href: "/hesabim/siparisler", label: "Orders", icon: Package },
      { href: "/hesabim/adresler", label: "Addresses", icon: MapPin },
    ],
    logout: "Sign Out",
    profile: "Profile",
    shop: "Shop",
    luxuryMember: "Luxury Member",
    order: "Order",
  },
} as const;

function getNavClass(isActive: boolean) {
  if (isActive) {
    return "bg-[#2a2a2a] text-[#f2ca50] opacity-100 shadow-[inset_0_0_15px_rgba(242,202,80,0.1)]";
  }

  return "text-[#d0c5af] opacity-60 hover:bg-[#1c1b1b] hover:opacity-100";
}

export function AccountSidebar({ locale = "tr", userName, userEmail, userRole = "CUSTOMER" }: AccountSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const t = copy[locale];

  return (
    <>
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-[#4d4635]/10 bg-[#131313] pt-24 md:flex md:flex-col">
        <div className="px-8 pb-12 pt-6">
          <h2 className="font-serif text-xl text-[#d4af37]">The Collector</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#d0c5af]/60">
            {userRole === "ADMIN" ? t.adminMember : t.luxuryMember}
          </p>
          <p className="mt-5 font-serif text-lg text-[#f2ca50]">{userName}</p>
          <p className="mt-2 break-all text-sm text-[#d0c5af]/75">{userEmail}</p>
        </div>

        <nav className="flex flex-col gap-1">
          {t.links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <a
                key={link.href}
                className={`flex items-center gap-4 px-8 py-4 text-sm uppercase tracking-[0.18em] transition-all duration-300 ${getNavClass(isActive)}`}
                href={link.href}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-auto pb-8">
          <button
            className="flex w-full items-center gap-4 px-8 py-4 text-sm uppercase tracking-[0.18em] text-[#ffb4ab] opacity-60 transition-all duration-300 hover:bg-[#1c1b1b] hover:opacity-100"
            onClick={() => logout()}
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-[#4d4635]/20 bg-[#131313]/90 px-6 py-4 backdrop-blur-xl md:hidden">
        <a className="flex flex-col items-center gap-1 text-[#f2ca50]" href="/hesabim">
          <User className="h-5 w-5" />
          <span className="text-[10px] uppercase tracking-tight">{t.profile}</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#d0c5af]" href="/hesabim/siparisler">
          <Package className="h-5 w-5" />
          <span className="text-[10px] uppercase tracking-tight">{t.order}</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-[#d0c5af]" href="/magaza">
          <Store className="h-5 w-5" />
          <span className="text-[10px] uppercase tracking-tight">{t.shop}</span>
        </a>
      </div>
    </>
  );
}
