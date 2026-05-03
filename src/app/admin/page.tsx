import Link from "next/link";

import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import {
  getAdminOrdersRepo,
  getAdminProductsRepo,
  getAdminUsersRepo,
} from "@/lib/repositories/admin-repository";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const adminUser = await readCurrentAdminUser();
  const [orders, products, users] = await Promise.all([
    getAdminOrdersRepo(),
    getAdminProductsRepo(),
    getAdminUsersRepo(),
  ]);

  const openOrders = orders.filter((order) =>
    ["PENDING", "PAID", "PREPARING", "OUT_FOR_DELIVERY"].includes(order.status),
  );
  const returnRequests = orders.filter((order) => ["CANCELLED", "REFUNDED"].includes(order.status));
  const revenue = orders.reduce((total, order) => total + order.grandTotal, 0);

  return (
    <AdminShell
      currentPath="/admin"
      description="Gerçek yönetim aksiyonları: sipariş takibi, ürün ekleme, kupon oluşturma, kullanıcı listesi ve iade talepleri."
      initialUser={adminUser}
      title="Admin Dashboard"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["Sipariş", String(orders.length)],
          ["Açık Sipariş", String(openOrders.length)],
          ["İade / İptal", String(returnRequests.length)],
          ["Ürün", String(products.length)],
          ["Kullanıcı", String(users.length)],
        ].map(([label, value]) => (
          <div key={label} className="panel p-5">
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="panel p-6">
          <h2 className="font-serif text-3xl text-[var(--color-ink)]">Hızlı işlemler</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Çalışmayan vitrin/config kısayolları kaldırıldı. Bu bölüm yalnızca gerçek sayfalara gider.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["/admin/urunler/yeni", "Yeni ürün ekle", "Ürün adı, fiyat, stok, kategori ve görsel gir."],
              ["/admin/siparisler", "Siparişleri gör", "Gerçek sipariş yoksa liste boş ve sayaç 0 kalır."],
              ["/admin/iade-talepleri", "İade talepleri", "İptal veya iade durumundaki siparişleri takip et."],
              ["/admin/kuponlar", "Kupon oluştur", "İndirim kodu ekle ve mevcut kuponları gör."],
              ["/admin/kullanicilar", "Kullanıcıları gör", "Kayıtlı müşteri ve admin hesaplarını listele."],
              ["/admin/sifre", "Şifre değiştir", "Admin hesabı şifresi için yönlendirme ve notlar."],
            ].map(([href, title, description]) => (
              <Link
                className="rounded-[1.5rem] border border-[var(--color-line)] bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                href={href}
                key={href}
              >
                <div className="font-semibold text-[var(--color-ink)]">{title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <div className="text-sm text-[var(--color-muted)]">Toplam ciro</div>
          <div className="mt-2 text-3xl font-semibold text-[var(--color-ink)]">{formatPrice(revenue)}</div>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Sipariş oluşmadığı sürece ciro ve sipariş sayaçları 0 görünür. Demo siparişler dashboard’dan kaldırıldı.
          </p>
        </aside>
      </div>
    </AdminShell>
  );
}
