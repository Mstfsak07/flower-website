import Link from "next/link";

import { seedOrders } from "@/lib/data";

export default function AccountPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="panel p-5">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-[var(--color-ink)]">Hesabim</h1>
            <p className="text-sm text-[var(--color-muted)]">Demo musteri paneli</p>
          </div>
          <div className="mt-5 space-y-2 text-sm">
            <Link className="block rounded-2xl bg-[var(--color-card)] px-4 py-3" href="/hesabim/siparisler">
              Siparisler
            </Link>
            <Link className="block rounded-2xl bg-[var(--color-card)] px-4 py-3" href="/hesabim/adresler">
              Adresler
            </Link>
            <Link className="block rounded-2xl bg-[var(--color-card)] px-4 py-3" href="/hesabim/profil">
              Profil
            </Link>
          </div>
        </aside>
        <div className="panel p-8">
          <h2 className="font-serif text-4xl text-[var(--color-ink)]">Son Siparisler</h2>
          <div className="mt-6 space-y-4">
            {seedOrders.map((order) => (
              <div key={order.id} className="rounded-[1.5rem] bg-[var(--color-card)] p-5">
                <div className="flex justify-between gap-4">
                  <div className="font-medium">{order.orderNumber}</div>
                  <div>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
