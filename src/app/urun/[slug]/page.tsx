import { notFound } from "next/navigation";
import { BotanicalProductDetail } from "@/components/botanical/product-detail";
import { getProductBySlug, getSimilarProducts, products } from "@/lib/data";
import { getLocale } from "@/lib/i18n";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getSimilarProducts(product);
  const similar = related.length >= 4 ? related.slice(0, 4) : products.filter((item) => item.id !== product.id).slice(0, 4);
  return <BotanicalProductDetail product={product} similar={similar} locale={locale} />;
}
