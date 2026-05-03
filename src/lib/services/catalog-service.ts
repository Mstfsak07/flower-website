import "server-only";

import { categories, coupons, deliveryZones, featuredProducts, getCategoryBySlug, getProductBySlug, products } from "@/lib/data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import type { Coupon, DeliveryZone, OrderCartInputItem, Product } from "@/lib/types";

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

function toNumber(value: number | string | { toString(): string } | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return Number(value.toString());
}

async function getProductById(productId: string): Promise<Product | null> {
  if (env.isDemoMode) {
    return products.find((product) => product.id === productId && product.isActive) ?? null;
  }

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      options: { include: { values: true } },
    },
  });

  if (!product) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? "",
    description: product.description ?? "",
    sku: product.sku,
    basePrice: toNumber(product.basePrice),
    compareAtPrice: product.compareAtPrice ? toNumber(product.compareAtPrice) : undefined,
    costPrice: toNumber(product.costPrice),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    stockTracking: product.stockTracking,
    stockQuantity: product.stockQuantity,
    minPreparationHours: product.minPreparationHours,
    categoryId: product.categoryId,
    images: product.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText ?? product.name,
      sortOrder: image.sortOrder,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      priceDelta: toNumber(variant.priceDelta),
      stockQuantity: variant.stockQuantity,
      sku: variant.sku ?? "",
      isActive: variant.isActive,
    })),
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      type: option.type,
      isRequired: option.isRequired,
      values: option.values.map((value) => ({
        id: value.id,
        value: value.value,
        priceDelta: toNumber(value.priceDelta),
      })),
    })),
    deliveryZoneIds: deliveryZones.filter((zone) => zone.isActive).map((zone) => zone.id),
    badges: [],
  };
}

export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) {
    return null;
  }

  if (env.isDemoMode) {
    return coupons.find((coupon) => coupon.code === normalizedCode) ?? null;
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon) {
    return null;
  }

  return {
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: toNumber(coupon.value),
    minOrderAmount: toNumber(coupon.minOrderAmount),
    maxDiscountAmount: coupon.maxDiscountAmount ? toNumber(coupon.maxDiscountAmount) : undefined,
    usageLimit: coupon.usageLimit ?? undefined,
    usedCount: coupon.usedCount,
    startsAt: coupon.startsAt.toISOString(),
    endsAt: coupon.endsAt.toISOString(),
    isActive: coupon.isActive,
  };
}

export async function findDeliveryZone(city: string, district: string): Promise<DeliveryZone | null> {
  const normalizedCity = city.trim().toLocaleLowerCase("tr-TR");
  const normalizedDistrict = district.trim().toLocaleLowerCase("tr-TR");

  if (env.isDemoMode) {
    return (
      deliveryZones.find(
        (entry) =>
          entry.city.toLocaleLowerCase("tr-TR") === normalizedCity &&
          entry.district.toLocaleLowerCase("tr-TR") === normalizedDistrict,
      ) ?? null
    );
  }

  const zone = await prisma.deliveryZone.findFirst({
    where: {
      isActive: true,
      city: { equals: city.trim(), mode: "insensitive" },
      district: { equals: district.trim(), mode: "insensitive" },
    },
  });

  if (!zone) {
    return null;
  }

  return {
    id: zone.id,
    name: zone.name,
    city: zone.city,
    district: zone.district,
    fee: toNumber(zone.fee),
    minDeliveryHours: zone.minDeliveryHours,
    sameDayAvailable: zone.sameDayAvailable,
    cutoffHour: zone.cutoffHour,
    isActive: zone.isActive,
  };
}

export async function resolveCanonicalCartItems(items: OrderCartInputItem[]) {
  const resolvedItems = await Promise.all(
    items.map(async (item) => {
      const product = await getProductById(item.productId);
      if (!product) {
        throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
      }

      const variant = item.variantId
        ? product.variants.find((entry) => entry.id === item.variantId && entry.isActive)
        : undefined;

      if (item.variantId && !variant) {
        throw new Error(`VARIANT_NOT_FOUND:${item.productId}:${item.variantId}`);
      }

      const optionEntries = Object.entries(item.selectedOptions ?? {});
      const invalidOption = optionEntries.find(([optionName, selectedValue]) => {
        const option = product.options.find((entry) => entry.name === optionName);
        if (!option) {
          return true;
        }

        if (option.type === "BOOLEAN") {
          return typeof selectedValue !== "boolean";
        }

        if (option.type === "SELECT") {
          return !option.values?.some((value) => value.value === selectedValue);
        }

        return typeof selectedValue !== "string";
      });

      if (invalidOption) {
        throw new Error(`INVALID_OPTION:${item.productId}:${invalidOption[0]}`);
      }

      const requiredOptionMissing = product.options.find(
        (option) =>
          option.isRequired &&
          !(item.selectedOptions && Object.prototype.hasOwnProperty.call(item.selectedOptions, option.name)),
      );

      if (requiredOptionMissing) {
        throw new Error(`MISSING_OPTION:${item.productId}:${requiredOptionMissing.name}`);
      }

      const selectedOptionsPrice = optionEntries.reduce((total, [optionName, selectedValue]) => {
        const option = product.options.find((entry) => entry.name === optionName);
        if (!option || option.type !== "SELECT") {
          return total;
        }

        const selected = option.values?.find((value) => value.value === selectedValue);
        return total + (selected?.priceDelta ?? 0);
      }, 0);

      const unitPrice = product.basePrice + (variant?.priceDelta ?? 0) + selectedOptionsPrice;
      const variantName = variant ? `${variant.name}: ${variant.value}` : undefined;

      return {
        productId: product.id,
        productName: product.name,
        variantId: item.variantId,
        variantName,
        quantity: item.quantity,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
        note: item.note?.trim() || undefined,
        selectedOptions: item.selectedOptions ?? undefined,
      };
    }),
  );

  return {
    items: resolvedItems,
    subtotal: resolvedItems.reduce((total, item) => total + item.totalPrice, 0),
  };
}
