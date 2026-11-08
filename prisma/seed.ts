import { CouponType, InquiryStatus, PrismaClient, ProductOptionType, UserRole } from "@prisma/client";

import { categories, contentPages, coupons, deliveryZones, heroSlides, products, seedInquiries, siteSettings, visualExperienceConfigs } from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  // Admin user for DB-backed authentication.
  // Set ADMIN_SEED_PASSWORD_HASH to a precomputed hash generated with the app's auth helper.
  // When DATABASE_URL is configured, login prefers this persisted admin over demo credentials.
  const adminPasswordHash = process.env.ADMIN_SEED_PASSWORD_HASH ?? null;
  await prisma.user.upsert({
    where: { email: "admin@rivacicekantalya.test" },
    update: { passwordHash: adminPasswordHash },
    create: {
      name: "Admin User",
      email: "admin@rivacicekantalya.test",
      phone: "05320000000",
      role: UserRole.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  for (const fullCategory of categories) {
    // group yalnizca vitrinde kullanilir, veritabaninda kolonu yok
    const { group, ...category } = fullCategory;
    void group;
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        sku: product.sku,
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        costPrice: product.costPrice,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        stockTracking: product.stockTracking,
        stockQuantity: product.stockQuantity,
        minPreparationHours: product.minPreparationHours,
        categoryId: product.categoryId,
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        sku: product.sku,
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        costPrice: product.costPrice,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        stockTracking: product.stockTracking,
        stockQuantity: product.stockQuantity,
        minPreparationHours: product.minPreparationHours,
        categoryId: product.categoryId,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productVariant.deleteMany({ where: { productId: saved.id } });
    await prisma.productOption.deleteMany({ where: { productId: saved.id } });

    for (const image of product.images) {
      await prisma.productImage.create({
        data: {
          productId: saved.id,
          imageUrl: image.imageUrl,
          altText: image.altText,
          sortOrder: image.sortOrder,
        },
      });
    }

    for (const variant of product.variants) {
      await prisma.productVariant.create({
        data: {
          productId: saved.id,
          name: variant.name,
          value: variant.value,
          priceDelta: variant.priceDelta,
          stockQuantity: variant.stockQuantity,
          sku: variant.sku,
          isActive: variant.isActive,
        },
      });
    }

    for (const option of product.options) {
      const createdOption = await prisma.productOption.create({
        data: {
          productId: saved.id,
          name: option.name,
          type: option.type as ProductOptionType,
          isRequired: option.isRequired,
        },
      });

      for (const value of option.values ?? []) {
        await prisma.productOptionValue.create({
          data: {
            optionId: createdOption.id,
            value: value.value,
            priceDelta: value.priceDelta,
          },
        });
      }
    }
  }

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {
        type: coupon.type as CouponType,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        startsAt: new Date(coupon.startsAt),
        endsAt: new Date(coupon.endsAt),
        isActive: coupon.isActive,
      },
      create: {
        code: coupon.code,
        type: coupon.type as CouponType,
        value: coupon.value,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        startsAt: new Date(coupon.startsAt),
        endsAt: new Date(coupon.endsAt),
        isActive: coupon.isActive,
      },
    });
  }

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.upsert({
      where: { id: zone.id },
      update: zone,
      create: zone,
    });
  }

  for (const inquiry of seedInquiries) {
    await prisma.wholesaleInquiry.upsert({
      where: { id: inquiry.id },
      update: {
        ...inquiry,
        eventDate: new Date(inquiry.eventDate),
        status: inquiry.status as InquiryStatus,
      },
      create: {
        ...inquiry,
        eventDate: new Date(inquiry.eventDate),
        status: inquiry.status as InquiryStatus,
      },
    });
  }

  for (const page of contentPages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: slide.id },
      update: slide,
      create: slide,
    });
  }

  for (const config of visualExperienceConfigs) {
    await prisma.visualExperienceConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config,
    });
  }

  for (const [key, value] of Object.entries(siteSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
