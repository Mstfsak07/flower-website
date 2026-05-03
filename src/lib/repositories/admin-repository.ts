import { coupons, products, seedOrders, siteSettings, visualExperienceConfigs } from "@/lib/data";
import { env } from "@/lib/env";
import { Socket } from "node:net";
import { getDemoAdminCredentials, readStoredAccounts } from "@/lib/auth-server";
import { demoOrderStore, demoReturnRequestStore, prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type {
  AdminUserSummary,
  Coupon,
  Order,
  OrderItem,
  Product,
  ReturnRequest,
  ReturnRequestType,
  WholesaleInquiry,
} from "@/lib/types";

type AdminProductInput = {
  name: string;
  slug?: string;
  shortDescription: string;
  description: string;
  imageUrl?: string;
  sku: string;
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  stockTracking?: boolean;
  stockQuantity?: number;
  minPreparationHours?: number;
  categoryId: string;
};

type AdminProductPatch = Partial<AdminProductInput>;

type AdminOrderStatusInput = {
  status: Order["status"];
  paymentStatus?: Order["paymentStatus"];
};

type AdminCouponInput = {
  code: string;
  type: Coupon["type"];
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startsAt: string;
  endsAt: string;
  isActive?: boolean;
};

type AccountReturnRequestInput = {
  orderId: string;
  requestType: ReturnRequestType;
  itemIds: string[];
  reason: string;
  note?: string;
};

type DemoState = {
  coupons: Coupon[];
  inquiries: WholesaleInquiry[];
  orders: Order[];
  products: Product[];
};

type StoredAccountLike = {
  birthDate?: string;
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
};

declare global {
  var __cicekciAdminDemoState__: DemoState | undefined;
}

const DATABASE_PRECHECK_TIMEOUT_MS = 250;
const DATABASE_UNAVAILABLE_COOLDOWN_MS = 15_000;

let databaseUnavailableUntil = 0;

function isDatabaseUnavailable(error: unknown) {
  return error instanceof Error && /can't reach database server|PrismaClientInitializationError/i.test(error.message);
}

function isDatabaseCooldownActive() {
  return databaseUnavailableUntil > Date.now();
}

function markDatabaseUnavailable() {
  databaseUnavailableUntil = Date.now() + DATABASE_UNAVAILABLE_COOLDOWN_MS;
}

function clearDatabaseUnavailable() {
  databaseUnavailableUntil = 0;
}

function getDatabaseEndpoint() {
  if (!env.DATABASE_URL) {
    return null;
  }

  try {
    const url = new URL(env.DATABASE_URL);
    const isLocalHost = url.hostname === "localhost" || url.hostname === "127.0.0.1";

    return {
      host: url.hostname,
      isLocalHost,
      port: Number(url.port || "5432"),
    };
  } catch {
    return null;
  }
}

async function canReachLocalDatabaseQuickly() {
  const endpoint = getDatabaseEndpoint();
  if (!endpoint?.isLocalHost) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const socket = new Socket();
    let settled = false;

    const finish = (reachable: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      socket.destroy();
      resolve(reachable);
    };

    socket.setTimeout(DATABASE_PRECHECK_TIMEOUT_MS);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(endpoint.port, endpoint.host);
  });
}

async function canUseDatabase() {
  if (env.isDemoMode) {
    return false;
  }

  if (isDatabaseCooldownActive()) {
    return false;
  }

  const reachable = await canReachLocalDatabaseQuickly();
  if (!reachable) {
    markDatabaseUnavailable();
    return false;
  }

  return true;
}

function cloneDemoState(): DemoState {
  return {
    coupons: structuredClone(coupons),
    inquiries: [],
    orders: [],
    products: structuredClone(products),
  };
}

function getDemoState() {
  global.__cicekciAdminDemoState__ ??= cloneDemoState();
  return global.__cicekciAdminDemoState__;
}

function getMergedDemoOrders() {
  const stateOrders = getDemoState().orders;
  const runtimeOrders = demoOrderStore.list();
  const explicitTestOrders = seedOrders.filter(
    (order) => order.customerEmail.trim().toLowerCase() === "cleimp.twich@gmail.com",
  );

  return Array.from(
    new Map(
      [...runtimeOrders, ...explicitTestOrders, ...stateOrders].map((order) => [
        order.orderNumber,
        structuredClone(order),
      ]),
    ).values(),
  ).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function summarizeStoredAccount(account: StoredAccountLike): AdminUserSummary {
  const normalizedEmail = account.email.trim().toLowerCase();
  const orders = getMergedDemoOrders().filter(
    (order) => order.customerEmail.trim().toLowerCase() === normalizedEmail,
  );

  return {
    addressCount: 0,
    createdAt: undefined,
    email: normalizedEmail,
    emailVerified: Boolean(account.emailVerified || account.role === "ADMIN"),
    id: account.id,
    name: account.name,
    orderCount: orders.length,
    phone: account.phone,
    role: account.role,
  };
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function serializeOrderItem(item: {
  id: string;
  note: string | null;
  productId: string | null;
  productName: string;
  quantity: number;
  selectedOptionsJson: unknown;
  totalPrice: unknown;
  unitPrice: unknown;
  variantName: string | null;
}): OrderItem {
  return {
    id: item.id,
    note: item.note ?? undefined,
    productId: item.productId ?? "",
    productName: item.productName,
    quantity: item.quantity,
    selectedOptionsJson:
      item.selectedOptionsJson == null ? undefined : JSON.stringify(item.selectedOptionsJson),
    totalPrice: toNumber(item.totalPrice),
    unitPrice: toNumber(item.unitPrice),
    variantName: item.variantName ?? undefined,
  };
}

function serializeOrder(order: {
  addressSnapshotJson: unknown;
  cardMessage: string | null;
  couponCode: string | null;
  createdAt: Date | string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  deliveryDate: Date | string;
  deliveryFee: unknown;
  deliverySlot: string;
  discountTotal: unknown;
  grandTotal: unknown;
  id: string;
  items?: Array<{
    id: string;
    note: string | null;
    productId: string | null;
    productName: string;
    quantity: number;
    selectedOptionsJson: unknown;
    totalPrice: unknown;
    unitPrice: unknown;
    variantName: string | null;
  }>;
  note: string | null;
  orderNumber: string;
  paymentMethod: Order["paymentMethod"];
  paymentStatus: Order["paymentStatus"];
  recipientName: string;
  recipientPhone: string;
  status: Order["status"];
  subtotal: unknown;
  updatedAt: Date | string;
}): Order {
  return {
    addressSnapshotJson:
      typeof order.addressSnapshotJson === "string"
        ? order.addressSnapshotJson
        : JSON.stringify(order.addressSnapshotJson),
    cardMessage: order.cardMessage ?? undefined,
    couponCode: order.couponCode ?? undefined,
    createdAt: new Date(order.createdAt).toISOString(),
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryDate:
      typeof order.deliveryDate === "string"
        ? order.deliveryDate
        : order.deliveryDate.toISOString().slice(0, 10),
    deliveryFee: toNumber(order.deliveryFee),
    deliverySlot: order.deliverySlot,
    discountTotal: toNumber(order.discountTotal),
    grandTotal: toNumber(order.grandTotal),
    id: order.id,
    items: order.items?.map(serializeOrderItem) ?? [],
    note: order.note ?? undefined,
    orderNumber: order.orderNumber,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    recipientName: order.recipientName,
    recipientPhone: order.recipientPhone,
    status: order.status,
    subtotal: toNumber(order.subtotal),
    updatedAt: new Date(order.updatedAt).toISOString(),
  };
}

function serializeProduct(product: {
  basePrice: unknown;
  categoryId: string;
  compareAtPrice: unknown;
  costPrice: unknown;
  description: string | null;
  id: string;
  images?: Array<{ altText: string | null; id: string; imageUrl: string; sortOrder: number }>;
  isActive: boolean;
  isFeatured: boolean;
  minPreparationHours: number;
  name: string;
  options?: Array<{
    id: string;
    isRequired: boolean;
    name: string;
    type: "TEXT" | "SELECT" | "BOOLEAN";
    values?: Array<{ id: string; priceDelta: unknown; value: string }>;
  }>;
  shortDescription: string | null;
  sku: string;
  slug: string;
  stockQuantity: number;
  stockTracking: boolean;
  variants?: Array<{
    id: string;
    isActive: boolean;
    name: string;
    priceDelta: unknown;
    sku: string | null;
    stockQuantity: number;
    value: string;
  }>;
}): Product {
  return {
    badges: [],
    basePrice: toNumber(product.basePrice),
    categoryId: product.categoryId,
    compareAtPrice: product.compareAtPrice == null ? undefined : toNumber(product.compareAtPrice),
    costPrice: product.costPrice == null ? 0 : toNumber(product.costPrice),
    deliveryZoneIds: [],
    description: product.description ?? "",
    id: product.id,
    images:
      product.images?.map((image) => ({
        altText: image.altText ?? product.name,
        id: image.id,
        imageUrl: image.imageUrl,
        sortOrder: image.sortOrder,
      })) ?? [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    minPreparationHours: product.minPreparationHours,
    name: product.name,
    options:
      product.options?.map((option) => ({
        id: option.id,
        isRequired: option.isRequired,
        name: option.name,
        type: option.type,
        values:
          option.values?.map((value) => ({
            id: value.id,
            priceDelta: toNumber(value.priceDelta),
            value: value.value,
          })) ?? [],
      })) ?? [],
    shortDescription: product.shortDescription ?? "",
    sku: product.sku,
    slug: product.slug,
    stockQuantity: product.stockQuantity,
    stockTracking: product.stockTracking,
    variants:
      product.variants?.map((variant) => ({
        id: variant.id,
        isActive: variant.isActive,
        name: variant.name,
        priceDelta: toNumber(variant.priceDelta),
        sku: variant.sku ?? "",
        stockQuantity: variant.stockQuantity,
        value: variant.value,
      })) ?? [],
  };
}

function serializeInquiry(inquiry: {
  budget: unknown;
  city: string;
  companyName: string | null;
  createdAt: Date | string;
  details: string;
  district: string;
  email: string;
  eventDate: Date | string;
  eventType: string;
  fullName: string;
  id: string;
  phone: string;
  quantity: number;
  status: WholesaleInquiry["status"];
  updatedAt: Date | string;
}): WholesaleInquiry {
  return {
    budget: toNumber(inquiry.budget),
    city: inquiry.city,
    companyName: inquiry.companyName ?? undefined,
    createdAt: new Date(inquiry.createdAt).toISOString(),
    details: inquiry.details,
    district: inquiry.district,
    email: inquiry.email,
    eventDate:
      typeof inquiry.eventDate === "string"
        ? inquiry.eventDate
        : inquiry.eventDate.toISOString().slice(0, 10),
    eventType: inquiry.eventType,
    fullName: inquiry.fullName,
    id: inquiry.id,
    phone: inquiry.phone,
    quantity: inquiry.quantity,
    status: inquiry.status,
    updatedAt: new Date(inquiry.updatedAt).toISOString(),
  };
}

function normalizeProductInput(input: AdminProductInput) {
  return {
    basePrice: input.basePrice,
    categoryId: input.categoryId,
    compareAtPrice: input.compareAtPrice,
    costPrice: input.costPrice,
    description: input.description,
    isActive: input.isActive ?? true,
    isFeatured: input.isFeatured ?? false,
    minPreparationHours: input.minPreparationHours ?? 2,
    name: input.name.trim(),
    shortDescription: input.shortDescription.trim(),
    sku: input.sku.trim(),
    slug: slugify(input.slug?.trim() || input.name),
    stockQuantity: input.stockQuantity ?? 0,
    stockTracking: input.stockTracking ?? true,
  };
}

function normalizeProductPatch(input: AdminProductPatch) {
  const patch: Record<string, unknown> = {};

  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.slug !== undefined || input.name !== undefined) {
    patch.slug = slugify(input.slug?.trim() || input.name || "");
  }
  if (input.shortDescription !== undefined) patch.shortDescription = input.shortDescription.trim();
  if (input.description !== undefined) patch.description = input.description.trim();
  if (input.sku !== undefined) patch.sku = input.sku.trim();
  if (input.basePrice !== undefined) patch.basePrice = input.basePrice;
  if (input.compareAtPrice !== undefined) patch.compareAtPrice = input.compareAtPrice;
  if (input.costPrice !== undefined) patch.costPrice = input.costPrice;
  if (input.isActive !== undefined) patch.isActive = input.isActive;
  if (input.isFeatured !== undefined) patch.isFeatured = input.isFeatured;
  if (input.stockTracking !== undefined) patch.stockTracking = input.stockTracking;
  if (input.stockQuantity !== undefined) patch.stockQuantity = input.stockQuantity;
  if (input.minPreparationHours !== undefined) patch.minPreparationHours = input.minPreparationHours;
  if (input.categoryId !== undefined) patch.categoryId = input.categoryId;

  return patch;
}

export async function getAdminOrdersRepo() {
  if (env.isDemoMode) {
    return getMergedDemoOrders();
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    clearDatabaseUnavailable();
    return orders.map(serializeOrder);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getMergedDemoOrders();
    }

    throw error;
  }
}

export async function getAdminOrderByIdRepo(id: string) {
  if (env.isDemoMode) {
    return getMergedDemoOrders().find((order) => order.id === id) ?? null;
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    clearDatabaseUnavailable();
    return order ? serializeOrder(order) : null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getMergedDemoOrders().find((order) => order.id === id) ?? null;
    }

    throw error;
  }
}

export async function getAdminUsersRepo(): Promise<AdminUserSummary[]> {
  const storedAccounts = await readStoredAccounts();
  const storedSummaries = storedAccounts.map(summarizeStoredAccount);
  const demoAdmin = getDemoAdminCredentials();
  const demoAdminSummary = summarizeStoredAccount({
    email: demoAdmin.email,
    emailVerified: true,
    id: "demo-admin",
    name: demoAdmin.name,
    role: "ADMIN",
  });

  if (!(await canUseDatabase())) {
    return Array.from(
      new Map([demoAdminSummary, ...storedSummaries].map((user) => [user.email, user])).values(),
    ).sort((left, right) => left.role.localeCompare(right.role) || left.email.localeCompare(right.email));
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        _count: {
          select: {
            addresses: true,
            orders: true,
          },
        },
        createdAt: true,
        email: true,
        emailVerifiedAt: true,
        id: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    clearDatabaseUnavailable();

    return users.map((user) => ({
      addressCount: user._count.addresses,
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      emailVerified: Boolean(user.emailVerifiedAt),
      id: user.id,
      name: user.name,
      orderCount: user._count.orders,
      phone: user.phone ?? undefined,
      role: user.role,
    }));
  } catch (error) {
    if (!isDatabaseUnavailable(error)) {
      throw error;
    }

    markDatabaseUnavailable();
    return Array.from(
      new Map([demoAdminSummary, ...storedSummaries].map((user) => [user.email, user])).values(),
    );
  }
}

export async function getAccountOrdersRepo(email: string, userId?: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!(await canUseDatabase())) {
    return getMergedDemoOrders()
      .filter((order) => order.customerEmail.trim().toLowerCase() === normalizedEmail)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  let orders = [];

  try {
    orders = await prisma.order.findMany({
      where: {
        OR: [
          {
            customerEmail: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
          ...(userId ? [{ userId }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getMergedDemoOrders()
        .filter((order) => order.customerEmail.trim().toLowerCase() === normalizedEmail)
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }

    throw error;
  }

  clearDatabaseUnavailable();
  return orders.map(serializeOrder);
}

export async function getAdminReturnRequestsRepo() {
  return demoReturnRequestStore
    .list()
    .map((request) => structuredClone(request))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createAccountReturnRequestRepo(
  email: string,
  userId: string | undefined,
  input: AccountReturnRequestInput,
) {
  const orders = await getAccountOrdersRepo(email, userId);
  const order = orders.find((entry) => entry.id === input.orderId);
  if (!order || !isReturnRequestAllowed(order, input.requestType)) {
    return null;
  }

  const selectedIds = new Set(input.itemIds);
  const selectedItems = order.items.filter((item) => selectedIds.has(item.id));
  if (selectedItems.length === 0) {
    return null;
  }

  const now = new Date().toISOString();
  const request: ReturnRequest = {
    createdAt: now,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    id: crypto.randomUUID(),
    items: selectedItems.map((item) => ({
      id: crypto.randomUUID(),
      orderItemId: item.id,
      productName: item.productName,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      variantName: item.variantName,
    })),
    note: input.note?.trim() || undefined,
    orderId: order.id,
    orderNumber: order.orderNumber,
    reason: input.reason,
    requestNumber: `TALEP-${Date.now().toString().slice(-8)}`,
    status: "NEW",
    type: input.requestType,
    updatedAt: now,
  };

  return demoReturnRequestStore.add(request);
}

function isReturnRequestAllowed(order: Order, type: ReturnRequestType) {
  if (order.status === "CANCELLED" || order.status === "REFUNDED") {
    return false;
  }

  if (type === "CANCEL") {
    return order.status !== "DELIVERED";
  }

  return order.paymentStatus === "PAID" || order.status === "DELIVERED";
}

export async function updateAdminOrderStatusRepo(id: string, input: AdminOrderStatusInput) {
  if (env.isDemoMode) {
    const order =
      getDemoState().orders.find((entry) => entry.id === id) ??
      demoOrderStore.list().find((entry) => entry.id === id);
    if (!order) return null;

    order.status = input.status;
    if (input.paymentStatus) {
      order.paymentStatus = input.paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    return order;
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      paymentStatus: input.paymentStatus,
      status: input.status,
    },
    include: { items: true },
  });

  return serializeOrder(order);
}

export async function getAdminProductsRepo() {
  if (env.isDemoMode) {
    return getDemoState().products.slice();
  }

  try {
    const adminProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        options: { include: { values: true } },
        variants: true,
      },
    });

    clearDatabaseUnavailable();
    return adminProducts.map(serializeProduct);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getDemoState().products.slice();
    }

    throw error;
  }
}

export async function getAdminProductByIdRepo(id: string) {
  if (env.isDemoMode) {
    return getDemoState().products.find((product) => product.id === id) ?? null;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        options: { include: { values: true } },
        variants: true,
      },
    });

    clearDatabaseUnavailable();
    return product ? serializeProduct(product) : null;
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getDemoState().products.find((product) => product.id === id) ?? null;
    }

    throw error;
  }
}

export async function createAdminProductRepo(input: AdminProductInput) {
  const normalized = normalizeProductInput(input);
  const imageUrl = input.imageUrl?.trim();

  if (env.isDemoMode) {
    const product: Product = {
      ...normalized,
      badges: [],
      costPrice: normalized.costPrice ?? Math.round(normalized.basePrice * 0.62),
      deliveryZoneIds: [],
      id: `demo-product-${Date.now()}`,
      images: imageUrl
        ? [
            {
              altText: normalized.name,
              id: `demo-image-${Date.now()}`,
              imageUrl,
              sortOrder: 0,
            },
          ]
        : [],
      options: [],
      variants: [],
    };

    getDemoState().products.unshift(product);
    return product;
  }

  let product;
  try {
    product = await prisma.product.create({
      data: {
        ...normalized,
        compareAtPrice: normalized.compareAtPrice ?? null,
        costPrice: normalized.costPrice ?? null,
        images: imageUrl
          ? {
              create: {
                altText: normalized.name,
                imageUrl,
                sortOrder: 0,
              },
            }
          : undefined,
      },
      include: {
        images: true,
        options: { include: { values: true } },
        variants: true,
      },
    });
  } catch (error) {
    if (!isDatabaseUnavailable(error)) {
      throw error;
    }

    markDatabaseUnavailable();
    const fallbackProduct: Product = {
      ...normalized,
      badges: [],
      costPrice: normalized.costPrice ?? Math.round(normalized.basePrice * 0.62),
      deliveryZoneIds: [],
      id: `demo-product-${Date.now()}`,
      images: imageUrl
        ? [
            {
              altText: normalized.name,
              id: `demo-image-${Date.now()}`,
              imageUrl,
              sortOrder: 0,
            },
          ]
        : [],
      options: [],
      variants: [],
    };
    getDemoState().products.unshift(fallbackProduct);
    return fallbackProduct;
  }

  return serializeProduct(product);
}

export async function updateAdminProductRepo(id: string, input: AdminProductPatch) {
  const patch = normalizeProductPatch(input);

  if (env.isDemoMode) {
    const product = getDemoState().products.find((entry) => entry.id === id);
    if (!product) return null;

    Object.assign(product, patch);
    return product;
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...patch,
      compareAtPrice: patch.compareAtPrice ?? undefined,
      costPrice: patch.costPrice ?? undefined,
    },
    include: {
      images: true,
      options: { include: { values: true } },
      variants: true,
    },
  });

  return serializeProduct(product);
}

export async function deleteAdminProductRepo(id: string) {
  if (env.isDemoMode) {
    const state = getDemoState();
    const index = state.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }

    state.products.splice(index, 1);
    return true;
  }

  await prisma.product.delete({
    where: { id },
  });

  return true;
}

export async function getAdminCouponsRepo() {
  if (env.isDemoMode) return getDemoState().coupons;

  try {
    const dbCoupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    clearDatabaseUnavailable();
    return dbCoupons.map((coupon) => ({
      code: coupon.code,
      endsAt: coupon.endsAt.toISOString(),
      id: coupon.id,
      isActive: coupon.isActive,
      maxDiscountAmount: coupon.maxDiscountAmount == null ? undefined : toNumber(coupon.maxDiscountAmount),
      minOrderAmount: toNumber(coupon.minOrderAmount),
      startsAt: coupon.startsAt.toISOString(),
      type: coupon.type,
      usageLimit: coupon.usageLimit ?? undefined,
      usedCount: coupon.usedCount,
      value: toNumber(coupon.value),
    }));
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getDemoState().coupons;
    }

    throw error;
  }
}

export async function createAdminCouponRepo(input: AdminCouponInput): Promise<Coupon> {
  const coupon: Coupon = {
    code: input.code.trim().toUpperCase(),
    endsAt: new Date(input.endsAt).toISOString(),
    id: `coupon-${Date.now()}`,
    isActive: input.isActive ?? true,
    maxDiscountAmount: input.maxDiscountAmount,
    minOrderAmount: input.minOrderAmount,
    startsAt: new Date(input.startsAt).toISOString(),
    type: input.type,
    usageLimit: input.usageLimit,
    usedCount: 0,
    value: input.value,
  };

  if (env.isDemoMode) {
    getDemoState().coupons.unshift(coupon);
    return coupon;
  }

  try {
    const created = await prisma.coupon.create({
      data: {
        code: coupon.code,
        endsAt: new Date(coupon.endsAt),
        isActive: coupon.isActive,
        maxDiscountAmount: coupon.maxDiscountAmount ?? null,
        minOrderAmount: coupon.minOrderAmount,
        startsAt: new Date(coupon.startsAt),
        type: coupon.type,
        usageLimit: coupon.usageLimit ?? null,
        value: coupon.value,
      },
    });

    clearDatabaseUnavailable();
    return {
      ...coupon,
      endsAt: created.endsAt.toISOString(),
      id: created.id,
      isActive: created.isActive,
      maxDiscountAmount: created.maxDiscountAmount == null ? undefined : toNumber(created.maxDiscountAmount),
      minOrderAmount: toNumber(created.minOrderAmount),
      startsAt: created.startsAt.toISOString(),
      usedCount: created.usedCount,
      value: toNumber(created.value),
    };
  } catch (error) {
    if (!isDatabaseUnavailable(error)) {
      throw error;
    }

    markDatabaseUnavailable();
    getDemoState().coupons.unshift(coupon);
    return coupon;
  }
}

export async function getAdminWholesaleInquiriesRepo() {
  if (env.isDemoMode) return getDemoState().inquiries;

  try {
    const inquiries = await prisma.wholesaleInquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    clearDatabaseUnavailable();
    return inquiries.map(serializeInquiry);
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      markDatabaseUnavailable();
      return getDemoState().inquiries;
    }

    throw error;
  }
}

export async function createWholesaleInquiryRepo(input: {
  companyName?: string;
  fullName: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  quantity: number;
  budget: number;
  city: string;
  district: string;
  details: string;
}) {
  if (env.isDemoMode) {
    const inquiry: WholesaleInquiry = {
      ...input,
      companyName: input.companyName?.trim() || undefined,
      createdAt: new Date().toISOString(),
      email: input.email.trim().toLowerCase(),
      eventDate: input.eventDate,
      id: `inq-${Date.now()}`,
      status: "NEW",
      updatedAt: new Date().toISOString(),
    };

    getDemoState().inquiries.unshift(inquiry);
    return inquiry;
  }

  const inquiry = await prisma.wholesaleInquiry.create({
    data: {
      budget: input.budget,
      city: input.city.trim(),
      companyName: input.companyName?.trim() || null,
      details: input.details.trim(),
      district: input.district.trim(),
      email: input.email.trim().toLowerCase(),
      eventDate: new Date(input.eventDate),
      eventType: input.eventType.trim(),
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      quantity: input.quantity,
      status: "NEW",
    },
  });

  return serializeInquiry(inquiry);
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
