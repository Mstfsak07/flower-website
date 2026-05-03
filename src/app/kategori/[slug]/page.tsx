import { notFound } from "next/navigation";

import { CollectionsPage } from "@/components/collections-page";
import { getCategoryBySlug } from "@/lib/data";
import { getLocale } from "@/lib/i18n";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CollectionsPage locale={locale} />;
}
