import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";
import { getAdminUsersRepo } from "@/lib/repositories/admin-repository";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const adminUser = await readCurrentAdminUser();
  const users = await getAdminUsersRepo();
  const admins = users.filter((user) => user.role === "ADMIN");
  const customers = users.filter((user) => user.role === "CUSTOMER");
  const verifiedUsers = users.filter((user) => user.emailVerified);
  const orderingCustomers = users.filter((user) => user.orderCount > 0);

  return (
    <AdminShell
      currentPath="/admin/kullanicilar"
      description="Siteye kayıt olan müşterileri, admin hesaplarını, doğrulama durumlarını ve sipariş ilişkilerini takip edin."
      initialUser={adminUser}
      title="Kayıtlı Kullanıcılar"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Toplam kullanıcı", String(users.length)],
          ["Müşteri hesabı", String(customers.length)],
          ["Admin hesabı", String(admins.length)],
          ["Sipariş veren", String(orderingCustomers.length)],
        ].map(([label, value]) => (
          <div className="panel p-5" key={label}>
            <div className="text-sm text-[var(--color-muted)]">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="panel p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                Hesap Listesi
              </div>
              <h2 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">
                Kayıtlı müşteriler ve yöneticiler
              </h2>
            </div>
            <div className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm text-[var(--color-muted)]">
              {verifiedUsers.length} doğrulanmış hesap
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--color-muted)]">
                <tr>
                  <th className="pb-3">Kullanıcı</th>
                  <th className="pb-3">Rol</th>
                  <th className="pb-3">Durum</th>
                  <th className="pb-3">Sipariş</th>
                  <th className="pb-3">Adres</th>
                  <th className="pb-3">Kayıt</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="border-t border-[var(--color-line)]" key={user.id}>
                    <td className="py-4">
                      <div className="font-semibold text-[var(--color-ink)]">{user.name}</div>
                      <div className="mt-1 text-xs text-[var(--color-muted)]">{user.email}</div>
                      {user.phone ? (
                        <div className="mt-1 text-xs text-[var(--color-muted)]">{user.phone}</div>
                      ) : null}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-[var(--color-card)] px-3 py-1 text-xs font-semibold text-[var(--color-ink)]">
                        {user.role === "ADMIN" ? "Admin" : "Müşteri"}
                      </span>
                    </td>
                    <td className="py-4">
                      {user.emailVerified ? "E-posta doğrulandı" : "Doğrulama bekliyor"}
                    </td>
                    <td className="py-4">{user.orderCount}</td>
                    <td className="py-4">{user.addressCount}</td>
                    <td className="py-4">
                      {user.createdAt ? formatDate(user.createdAt) : "Demo / geçici hesap"}
                    </td>
                  </tr>
                ))}
                {users.length === 0 ? (
                  <tr>
                    <td className="py-8 text-[var(--color-muted)]" colSpan={6}>
                      Henüz kayıtlı kullanıcı bulunamadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="panel h-fit p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Yönetim Notu
          </div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--color-muted)]">
            <p>
              Veritabanı aktifken bu liste `User` tablosundan gelir. Demo veya yerel cookie
              hesabı modunda yalnızca bu tarayıcıda kayıt edilmiş hesaplar ve demo admin
              görüntülenir.
            </p>
            <p>
              Sipariş sayısı, müşteri hesabı ile eşleşen sipariş ilişkisinden veya demo
              modunda e-posta eşleşmesinden hesaplanır.
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
