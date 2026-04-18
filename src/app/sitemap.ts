import type { MetadataRoute } from "next";

import { categories, contentPages, products, routeMap } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = routeMap.map((route) => ({
    url: `https://lunacicek.example${route.replace("[slug]", "mini-buketler")}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `https://lunacicek.example/kategori/${category.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((product) => ({
    url: `https://lunacicek.example/urun/${product.slug}`,
    lastModified: new Date(),
  }));

  const contentRoutes = contentPages.map((page) => ({
    url: `https://lunacicek.example/${page.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...categoryRoutes, ...productRoutes, ...contentRoutes];
}
