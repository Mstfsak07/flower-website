import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin-shell";
import { getProductById } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      currentPath="/admin/urunler"
      description="Urun detayinda fiyat, varyant ve teslimat bilgisi ozetlenir."
      title={product.name}
    >
      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div
          className="panel h-72 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.images[0]?.imageUrl})` }}
        />
        <div className="panel p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-[var(--color-muted)]">SKU</div>
              <div className="mt-1 font-semibold">{product.sku}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-muted)]">Fiyat</div>
              <div className="mt-1 font-semibold">{formatPrice(product.basePrice)}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-muted)]">Stok</div>
              <div className="mt-1 font-semibold">{product.stockQuantity}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-muted)]">Hazirlama</div>
              <div className="mt-1 font-semibold">{product.minPreparationHours} saat</div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-[var(--color-muted)]">{product.description}</p>
        </div>
      </div>
    </AdminShell>
  );
}
