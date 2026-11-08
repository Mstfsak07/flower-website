"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import type { NavLinkItem } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

type NavDropdownVariant = "glass" | "light";

type NavDropdownProps = {
  label: string;
  items: NavLinkItem[];
  active?: boolean;
  /** glass: ana sayfadaki 3D cam header, light: diger sayfalardaki acik header */
  variant: NavDropdownVariant;
  /** Uzun listeler (11-12 oge) icin iki sutun. */
  columns?: 1 | 2;
};

const styles = {
  glass: {
    trigger:
      "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 transition-colors hover:bg-white/15",
    triggerActive: "bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-white/30",
    triggerIdle: "",
    panel: "hero-menu-panel p-2",
    item: "block rounded-[1rem] px-4 py-2.5 text-[13px] font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white",
    itemFeatured: "text-white",
  },
  light: {
    trigger:
      "inline-flex items-center gap-1.5 border-b-2 pb-1.5 text-[13px] font-extrabold uppercase tracking-[0.1em] transition-colors duration-300",
    triggerActive: "border-[#aa2e28] text-[#9a241f]",
    triggerIdle: "border-transparent text-[#4b332f] hover:text-[#aa2e28]",
    panel:
      "rounded-[1.4rem] border border-[#e3c5bf] bg-[#fffaf7]/97 p-2 shadow-[0_24px_50px_-28px_rgba(170,46,40,0.28)] backdrop-blur-xl",
    item: "block rounded-[1rem] px-4 py-2.5 text-[13px] font-semibold text-[#4b332f] transition-colors hover:bg-[#fff1e8] hover:text-[#aa2e28]",
    itemFeatured: "text-[#9a241f]",
  },
} as const;

export function NavDropdown({ label, items, active = false, variant, columns = 1 }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const s = styles[variant];

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      ref={containerRef}
    >
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(s.trigger, active ? s.triggerActive : s.triggerIdle)}
        onClick={() => setOpen(true)}
        ref={triggerRef}
        type="button"
      >
        {label}
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          strokeWidth={2.2}
        />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-10 pt-3">
          <div
            className={cn(
              s.panel,
              columns === 2 ? "grid min-w-[21rem] grid-cols-2 gap-x-1" : "min-w-[13rem]",
            )}
            id={menuId}
            role="menu"
          >
            {items.map((item) => (
              <Link
                className={cn(
                  s.item,
                  item.featured && cn(s.itemFeatured, columns === 2 && "col-span-2"),
                )}
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
                prefetch={false}
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

type MobileNavGroupProps = {
  label: string;
  items: NavLinkItem[];
  active?: boolean;
  onNavigate?: () => void;
};

/** Mobil menude acilip kapanan kategori grubu (accordion). */
export function MobileNavGroup({ label, items, active = false, onNavigate }: MobileNavGroupProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between rounded-[1rem] px-4 py-3.5 text-left text-[16px] font-extrabold uppercase tracking-[0.11em] text-[#4b332f] transition-colors hover:bg-[#fff1e8] hover:text-[#aa2e28]",
          (active || open) && "bg-[#fff1e8] text-[#9a241f]",
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {label}
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} strokeWidth={2.4} />
      </button>
      {open ? (
        <div className="mt-1 grid grid-cols-1 gap-1 pl-2 sm:grid-cols-2" id={panelId}>
          {items.map((item) => (
            <Link
              className={cn(
                "rounded-[0.9rem] px-3 py-2.5 text-[14px] font-semibold normal-case tracking-normal text-[#6d5b57] transition-colors hover:bg-[#fff1e8] hover:text-[#aa2e28]",
                item.featured && "font-bold text-[#9a241f] sm:col-span-2",
              )}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
