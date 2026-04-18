"use client";

import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { useStore } from "@/components/providers/store-provider";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function AdminPage() {
  const { orders, inquiries } = useStore();
  const revenue = orders.reduce((total, order) => total + order.grandTotal, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.reduce((total, order) => total + order.grandTotal, 0);
  const pendingOrders = orders.filter((order) =>
    ["PENDING", "PAID", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status),
  );
  const lowStockProducts = products
    .filter((product) => product.stockTracking && product.stockQuantity <= 16)
    .sort((left, right) => left.stockQuantity - right.stockQuantity)
    .slice(0, 5);
  const orderStatusBreakdown = [
    { label: "Onay / Odeme Bekliyor", statuses: ["PENDING"] },
    { label: "Hazirlaniyor", statuses: ["PAID", "PREPARING"] },
    { label: "Kurye Asamasinda", statuses: ["OUT_FOR_DELIVERY"] },
    { label: "Tamamlandi", statuses: ["DELIVERED"] },
  ].map((group) => ({
    ...group,
    count: orders.filter((order) => group.statuses.includes(order.status)).length,
  }));
  const inquiryBreakdown = [
    { label: "Yeni", statuses: ["NEW"] },
    { label: "Degerlendiriliyor", statuses: ["REVIEWING"] },
    { label: "Teklif Gecildi", statuses: ["QUOTED"] },
    { label: "Kazanildi", statuses: ["WON"] },
  ].map((group) => ({
    ...group,
    count: inquiries.filter((inquiry) => group.statuses.includes(inquiry.status)).length,
  }));
  const quickActions = [
    {
      href: "/admin/siparisler",
      title: "Siparis akisini kontrol et",
      description: `${pendingOrders.length} acik siparis teslimat ve hazirlama tarafinda takip bekliyor.`,
    },
    {
      href: "/admin/toptan-talepler",
      title: "Toptan talepleri cevapla",
      description: `${inquiries.filter((inquiry) => inquiry.status === "NEW").length} yeni talep ilk geri donus bekliyor.`,
    },
    {
      href: "/admin/urunler",
      title: "Dusuk stogu tamamla",
      description: `${lowStockProducts.length} urun stok limiti altina yaklasti.`,
    },
    {
      href: "/admin/ayarlar",
      title: "Vitrin ve teslim ayarlarini guncelle",
      description: "Kampanya, teslim kesim saati ve premium vitrin ayarlarini hizla gozden gecir.",
    },
  ];

  return (
    <AdminShell
      currentPath="/admin"
      description="Tek magazali MVP operasyonu icin siparis, urun, talep ve kupon alanlarini hizli yonetecek sade panel."
      title="Admin Dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Toplam Siparis", String(orders.length)],
          ["Bekleyen Talepler", String(inquiries.length)],
          ["Aktif Urun", String(products.length)],
          ["Tahmini Ciro", formatPrice(revenue)],
        ].map(([label, value]) => (
          <div key={label} className="panel p-5">
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
        <div className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Bugunun Operasyonu
              </div>
              <h2 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">Gunluk akis ozeti</h2>
            </div>
            <div className="rounded-full bg-[var(--color-card)] px-4 py-2 text-sm text-[var(--color-muted)]">
              {todayOrders.length} siparis
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
              <div className="text-sm text-[var(--color-muted)]">Bugunun ciro tahmini</div>
              <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {formatPrice(todayRevenue)}
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
              <div className="text-sm text-[var(--color-muted)]">Hazirlama sirasinda</div>
              <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {
                  orders.filter((order) => ["PAID", "PREPARING"].includes(order.status)).length
                }
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-[var(--color-card)] p-5">
              <div className="text-sm text-[var(--color-muted)]">Kurye teslim bekleyen</div>
              <div className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {orders.filter((order) => order.status === "OUT_FOR_DELIVERY").length}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/80 p-4 transition hover:-translate-y-0.5"
                href={action.href}
              >
                <div className="text-base font-semibold text-[var(--color-ink)]">{action.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Durum Kirilimlari
          </div>
          <div className="mt-5 space-y-4">
            {orderStatusBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-[var(--color-ink)]">{item.label}</span>
                  <span className="font-semibold text-[var(--color-ink)]">{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--color-card)]">
                  <div
                    className="h-2 rounded-full bg-[var(--color-accent)]"
                    style={{ width: `${orders.length ? (item.count / orders.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-[var(--color-line)] pt-6">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Talep Hatti
            </div>
            <div className="mt-4 grid gap-3">
              {inquiryBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[1.25rem] bg-[var(--color-card)] px-4 py-3 text-sm"
                >
                  <span className="text-[var(--color-ink)]">{item.label}</span>
                  <span className="font-semibold text-[var(--color-ink)]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[var(--color-ink)]">Dusuk Stok</h2>
            <Link className="text-sm font-semibold text-[var(--color-accent)]" href="/admin/urunler">
              Stoklari Ac
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/75 p-4 text-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-[var(--color-ink)]">{product.name}</span>
                  <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
                    {product.stockQuantity} adet
                  </span>
                </div>
                <div className="mt-2 text-[var(--color-muted)]">
                  {product.categoryId} kategorisi, hazirlama suresi {product.minPreparationHours} saat.
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[var(--color-ink)]">Son Siparisler</h2>
            <Link className="text-sm font-semibold text-[var(--color-accent)]" href="/admin/siparisler">
              Tumunu Gor
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="rounded-[1.5rem] bg-[var(--color-card)] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">{order.orderNumber}</span>
                  <span>{order.status}</span>
                </div>
                <div className="mt-2 text-[var(--color-muted)]">{order.customerName}</div>
                <div className="mt-2 flex items-center justify-between text-[var(--color-muted)]">
                  <span>{order.items.length} kalem</span>
                  <span>{formatPrice(order.grandTotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[var(--color-ink)]">Toptan Talepler</h2>
            <Link className="text-sm font-semibold text-[var(--color-accent)]" href="/admin/toptan-talepler">
              Incele
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div key={inquiry.id} className="rounded-[1.5rem] bg-[var(--color-card)] p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold">{inquiry.fullName}</span>
                  <span>{inquiry.status}</span>
                </div>
                <div className="mt-2 text-[var(--color-muted)]">
                  {inquiry.eventType} - {inquiry.quantity} adet
                </div>
                <div className="mt-2 text-[var(--color-muted)]">
                  {formatPrice(inquiry.budget)} - {inquiry.city}/{inquiry.district}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
