import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
});

export const authLoginSchema = z.object({
  email: z.string().email().max(254).trim().toLowerCase(),
  password: z.string().min(6).max(128),
  redirectTo: z.string().max(256).optional(),
});

export const authRegisterSchema = z
  .object({
    name: z.string().min(2).max(120).trim(),
    email: z.string().email().max(254).trim().toLowerCase(),
    phone: z.string().min(10).max(20).trim().optional(),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Za-z]/, "Sifre en az bir harf icermeli.")
      .regex(/[0-9]/, "Sifre en az bir rakam icermeli."),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Sifreler eslesmiyor.",
    path: ["confirmPassword"],
  });

// ── Account schemas ───────────────────────────────────────────────────────────

export const profileUpdateSchema = z.object({
  birthDate: z.string().max(32).trim().optional().or(z.literal("")),
  name: z.string().min(2).max(120).trim(),
  email: z.string().email().max(254).trim().toLowerCase(),
  phone: z.string().min(10).max(20).trim().optional().or(z.literal("")),
  currentPassword: z.string().min(6).max(128).optional().or(z.literal("")),
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(6).max(128),
    nextPassword: z
      .string()
      .min(8)
      .max(128)
      .regex(/[A-Za-z]/, "Sifre en az bir harf icermeli.")
      .regex(/[0-9]/, "Sifre en az bir rakam icermeli."),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((input) => input.nextPassword === input.confirmPassword, {
    message: "Sifreler eslesmiyor.",
    path: ["confirmPassword"],
  });

export const addressCreateSchema = z.object({
  title: z.string().min(1).max(64).trim(),
  fullName: z.string().min(2).max(128).trim(),
  phone: z.string().min(10).max(20).trim(),
  city: z.string().min(2).max(64).trim(),
  district: z.string().min(2).max(64).trim(),
  neighborhood: z.string().min(2).max(128).trim(),
  addressLine: z.string().min(5).max(512).trim(),
  postalCode: z.string().max(10).trim().optional(),
  isDefault: z.boolean().optional(),
});

export const addressUpdateSchema = addressCreateSchema.partial();

export const returnRequestCreateSchema = z.object({
  orderId: z.string().min(1),
  requestType: z.enum(["CANCEL", "REFUND"]),
  itemIds: z.array(z.string().min(1)).min(1),
  reason: z.string().min(3).max(160).trim(),
  note: z.string().max(1000).trim().optional().or(z.literal("")),
});

// ── Admin schemas ─────────────────────────────────────────────────────────────

export const adminProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  shortDescription: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z.string().min(1).optional(),
  sku: z.string().min(1),
  basePrice: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  costPrice: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  stockTracking: z.boolean().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  minPreparationHours: z.number().int().nonnegative().optional(),
  categoryId: z.string().min(1),
});

export const adminProductPatchSchema = adminProductSchema.partial();

export const adminCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const adminCategoryPatchSchema = adminCategorySchema.partial();

export const adminCouponSchema = z.object({
  code: z.string().min(2).toUpperCase(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative(),
  maxDiscountAmount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  isActive: z.boolean().optional(),
});

export const adminCouponPatchSchema = adminCouponSchema.partial();

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PAID",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  paymentStatus: z
    .enum(["UNPAID", "PAID", "FAILED", "REFUNDED"])
    .optional(),
});

export const adminInquiryStatusSchema = z.object({
  status: z.enum(["NEW", "REVIEWING", "QUOTED", "WON", "LOST"]),
});

export const adminSettingsPatchSchema = z.record(z.string(), z.string());

export const couponValidationSchema = z.object({
  code: z.string().min(2).max(64).trim(),
  subtotal: z.number().nonnegative().max(1_000_000),
});

export const checkoutValidationSchema = z.object({
  customerName: z.string().min(2).max(128).trim(),
  customerPhone: z.string().min(10).max(20).trim(),
  customerEmail: z.string().email().max(254).trim().toLowerCase(),
  recipientName: z.string().min(2).max(128).trim(),
  recipientPhone: z.string().min(10).max(20).trim(),
  city: z.string().min(2).max(64).trim(),
  district: z.string().min(2).max(64).trim(),
  neighborhood: z.string().min(2).max(128).trim(),
  addressLine: z.string().min(5).max(512).trim(),
  deliveryDate: z.string().min(1).max(32).trim(),
  deliverySlot: z.string().min(1).max(64).trim(),
  paymentMethod: z.enum(["CARD", "BANK_TRANSFER", "CASH_ON_DELIVERY"]),
  cardMessage: z.string().max(512).optional(),
  note: z.string().max(1024).optional(),
  couponCode: z.string().max(64).optional(),
});

export const wholesaleInquirySchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  phone: z.string().min(10),
  email: z.string().email(),
  city: z.string().min(2),
  district: z.string().min(2),
  eventType: z.string().min(2),
  eventDate: z.string().min(1),
  quantity: z.number().int().positive(),
  budget: z.number().positive(),
  details: z.string().min(10),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  selectedOptions: z.record(z.string(), z.union([z.string(), z.boolean()])).optional(),
});

export const createOrderSchema = checkoutValidationSchema.extend({
  items: z.array(cartItemSchema).min(1).max(100),
});

export const orderTrackingLookupSchema = z.object({
  orderNumber: z.string().min(3).max(64).trim(),
  contact: z.string().min(5).max(254).trim(),
});
