import type { CartItem, Coupon, DeliveryZone } from "@/lib/types";

export function calculateSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export function calculateCouponDiscount(subtotal: number, coupon?: Coupon) {
  if (!coupon || subtotal < coupon.minOrderAmount || !coupon.isActive) {
    return 0;
  }

  const raw =
    coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  if (coupon.maxDiscountAmount) {
    return Math.min(raw, coupon.maxDiscountAmount);
  }

  return raw;
}

export function isSameDayAvailable(currentHour: number, zone: DeliveryZone) {
  return zone.sameDayAvailable && currentHour < zone.cutoffHour;
}

export function calculateGrandTotal(subtotal: number, discountTotal: number, deliveryFee: number) {
  return subtotal - discountTotal + deliveryFee;
}
