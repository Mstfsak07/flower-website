import { coupons, seedInquiries, seedOrders, siteSettings, visualExperienceConfigs } from "@/lib/data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function getAdminOrdersRepo() {
  if (env.isDemoMode) return seedOrders;

  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getAdminOrderByIdRepo(id: string) {
  if (env.isDemoMode) return seedOrders.find((order) => order.id === id) ?? null;

  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

export async function getAdminCouponsRepo() {
  if (env.isDemoMode) return coupons;

  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminWholesaleInquiriesRepo() {
  if (env.isDemoMode) return seedInquiries;

  return prisma.wholesaleInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminSettingsRepo() {
  if (env.isDemoMode) return siteSettings;

  const entries = await prisma.siteSetting.findMany();
  return Object.fromEntries(entries.map((entry) => [entry.key, entry.value]));
}

export async function getVisualConfigsRepo() {
  if (env.isDemoMode) return visualExperienceConfigs;

  return prisma.visualExperienceConfig.findMany({
    orderBy: { key: "asc" },
  });
}
