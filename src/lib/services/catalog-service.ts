import { categories, featuredProducts, getCategoryBySlug, getProductBySlug, products } from "@/lib/data";

export function listCategories() {
  return categories.filter((category) => category.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryDetail(slug: string) {
  return getCategoryBySlug(slug);
}

export function listProducts() {
  return products.filter((product) => product.isActive);
}

export function listFeaturedProducts() {
  return featuredProducts;
}

export function getProductDetail(slug: string) {
  return getProductBySlug(slug);
}
