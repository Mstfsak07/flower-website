import type { MetadataRoute } from "next";

import { categories, contentPages, products, routeMap } from "@/lib/data";
import { legalLinks } from "@/lib/site-config";
import { toAbsoluteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const uniqueRoutes = Array.from(
    new Set([
      ...routeMap,
      ...legalLinks.map((link) => link.href),
      "/teslimat-ve-iade",
    ]),
  );

  const routes = uniqueRoutes.map((route) => ({
    url: toAbsoluteUrl(route.replace("[slug]", "mini-buketler")),
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((category) => ({
    url: toAbsoluteUrl(`/kategori/${category.slug}`),
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: toAbsoluteUrl(`/urun/${product.slug}`),
    lastModified: new Date(),
  }));

  const contentRoutes = contentPages.map((page) => ({
    url: toAbsoluteUrl(`/${page.slug}`),
    lastModified: new Date(),
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...contentRoutes];
}
