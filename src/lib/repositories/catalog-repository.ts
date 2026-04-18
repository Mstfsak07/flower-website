import { categories, featuredProducts, getCategoryBySlug, getProductBySlug, products } from "@/lib/data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function getCategoriesRepo() {
  if (env.isDemoMode) {
    return categories.filter((category) => category.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCategoryBySlugRepo(slug: string) {
  if (env.isDemoMode) {
    return getCategoryBySlug(slug) ?? null;
  }

  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductsRepo() {
  if (env.isDemoMode) {
    return products.filter((product) => product.isActive);
  }

  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      images: true,
      variants: true,
      options: { include: { values: true } },
    },
  });
}

export async function getFeaturedProductsRepo() {
  if (env.isDemoMode) {
    return featuredProducts;
  }

  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      images: true,
      variants: true,
      options: { include: { values: true } },
    },
  });
}

export async function getProductBySlugRepo(slug: string) {
  if (env.isDemoMode) {
    return getProductBySlug(slug) ?? null;
  }

  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      variants: true,
      options: { include: { values: true } },
    },
  });
}
