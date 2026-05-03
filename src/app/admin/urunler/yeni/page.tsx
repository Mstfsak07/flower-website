import { AdminShell } from "@/components/admin-shell";
import { AdminProductForm } from "@/components/admin-product-form";
import { categories } from "@/lib/data";

export default function AdminNewProductPage() {
  return (
    <AdminShell
      currentPath="/admin/urunler/yeni"
      description="Yeni ürün ekleyin, kategori, fiyat, stok ve görsel bilgisini tek formdan kaydedin."
      title="Yeni Ürün"
    >
      <AdminProductForm categories={categories} />
    </AdminShell>
  );
}
