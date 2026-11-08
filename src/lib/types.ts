export type UserRole = "CUSTOMER" | "ADMIN";
export type AuthUser = {
  id?: string;
  birthDate?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  role: UserRole;
};

export type AuthSession = {
  user: AuthUser;
  issuedAt: string;
};
export type AdminUserSummary = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone?: string;
  role: UserRole;
  orderCount: number;
  addressCount: number;
  createdAt?: string;
};
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "CASH_ON_DELIVERY";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
export type InquiryStatus = "NEW" | "REVIEWING" | "QUOTED" | "WON" | "LOST";

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  priceDelta: number;
  stockQuantity: number;
  sku: string;
  isActive: boolean;
};

export type ProductOptionValue = {
  id: string;
  value: string;
  priceDelta: number;
};

export type ProductOption = {
  id: string;
  name: string;
  type: "TEXT" | "SELECT" | "BOOLEAN";
  isRequired: boolean;
  values?: ProductOptionValue[];
};

export type ProductImage = {
  id: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
  group: "type" | "occasion";
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  sku: string;
  basePrice: number;
  compareAtPrice?: number;
  costPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  stockTracking: boolean;
  stockQuantity: number;
  minPreparationHours: number;
  categoryId: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
  deliveryZoneIds: string[];
  badges?: string[];
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  variantId?: string;
  unitPrice: number;
  note?: string;
  selectedOptions?: Record<string, string | boolean>;
};

export type OrderCartInputItem = {
  productId: string;
  quantity: number;
  variantId?: string;
  note?: string;
  selectedOptions?: Record<string, string | boolean>;
};

export type DeliveryZone = {
  id: string;
  name: string;
  city: string;
  district: string;
  fee: number;
  minDeliveryHours: number;
  sameDayAvailable: boolean;
  cutoffHour: number;
  isActive: boolean;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
  selectedOptionsJson?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  grandTotal: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName: string;
  recipientPhone: string;
  deliveryDate: string;
  deliverySlot: string;
  cardMessage?: string;
  note?: string;
  addressSnapshotJson: string;
  couponCode?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type ReturnRequestType = "CANCEL" | "REFUND";
export type ReturnRequestStatus = "NEW" | "REVIEWING" | "APPROVED" | "REJECTED" | "COMPLETED";

export type ReturnRequestItem = {
  id: string;
  orderItemId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  totalPrice: number;
};

export type ReturnRequest = {
  id: string;
  requestNumber: string;
  type: ReturnRequestType;
  status: ReturnRequestStatus;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  note?: string;
  items: ReturnRequestItem[];
  createdAt: string;
  updatedAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
};

export type WholesaleInquiry = {
  id: string;
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
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  isActive: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  storeName: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram: string;
  facebook: string;
  deliveryCutoffHour: number;
  defaultDeliveryFee: number;
  seoTitle: string;
  seoDescription: string;
};

export type VisualExperienceConfig = {
  id: string;
  key: string;
  value: string;
  description?: string;
};

export type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  recipientName: string;
  recipientPhone: string;
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  deliveryDate: string;
  deliverySlot: string;
  paymentMethod: PaymentMethod;
  cardMessage?: string;
  note?: string;
  couponCode?: string;
};

export type CreateOrderPayload = CheckoutPayload & {
  items: OrderCartInputItem[];
};
