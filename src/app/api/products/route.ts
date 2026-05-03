import { NextResponse } from "next/server";

import { listProducts } from "@/lib/services/catalog-service";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const badge = url.searchParams.get("badge");
  const categoryId = url.searchParams.get("categoryId");
  const sameDay = url.searchParams.get("sameDay") === "true";
  const minPrice = Number(url.searchParams.get("minPrice") ?? "");
  const maxPrice = Number(url.searchParams.get("maxPrice") ?? "");

  const products = await listProducts();
  const filtered = products.filter((product) => {
    if (q) {
      const haystack = `${product.name} ${product.shortDescription} ${product.description} ${(product.badges ?? []).join(" ")}`;
      if (!normalize(haystack).includes(normalize(q))) {
        return false;
      }
    }

    if (badge && !(product.badges?.includes(badge) ?? false)) {
      return false;
    }

    if (categoryId && product.categoryId !== categoryId) {
      return false;
    }

    if (sameDay && !(product.badges?.includes("Ayni Gun") ?? false)) {
      return false;
    }

    if (!Number.isNaN(minPrice) && url.searchParams.has("minPrice") && product.basePrice < minPrice) {
      return false;
    }

    if (!Number.isNaN(maxPrice) && url.searchParams.has("maxPrice") && product.basePrice > maxPrice) {
      return false;
    }

    return true;
  });

  return NextResponse.json(filtered);
}
