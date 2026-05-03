import { AdminPasswordForm } from "@/components/admin-password-form";
import { AdminShell } from "@/components/admin-shell";
import { readCurrentAdminUser } from "@/lib/admin-guard";

export default async function AdminPasswordPage() {
  const adminUser = await readCurrentAdminUser();

  return (
    <AdminShell
      currentPath="/admin/sifre"
      description="Veritabanına kayıtlı admin hesabınızın şifresini değiştirin."
      initialUser={adminUser}
      title="Şifre Değiştir"
    >
      <AdminPasswordForm />
      <div className="panel max-w-2xl p-5 text-sm leading-7 text-[var(--color-muted)]">
        Demo admin hesabı kullanıyorsanız şifre `.env` dosyasındaki `ADMIN_PASSWORD` değerinden gelir.
        Veritabanına kayıtlı gerçek admin hesabında bu form doğrudan şifreyi günceller.
      </div>
    </AdminShell>
  );
}
