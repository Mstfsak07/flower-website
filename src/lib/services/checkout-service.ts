import type { CheckoutPayload } from "@/lib/types";
import { calculateCouponDiscount, calculateGrandTotal } from "@/lib/commerce";
import { findDeliveryZone, getCouponByCode } from "@/lib/services/catalog-service";

export async function validateCheckout(payload: CheckoutPayload) {
  const zone = await findDeliveryZone(payload.city, payload.district);

  return {
    deliveryZone: zone ?? null,
    supportsSameDay: Boolean(zone?.sameDayAvailable),
    paymentOptions: ["CARD", "BANK_TRANSFER", "CASH_ON_DELIVERY"],
  };
}

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { valid: false, discountTotal: 0, reason: "Coupon not found" };
  }

  const discountTotal = calculateCouponDiscount(subtotal, coupon);
  if (!discountTotal) {
    return { valid: false, discountTotal: 0, reason: "Minimum amount not reached" };
  }

  return { valid: true, discountTotal, coupon };
}

export async function summarizeCheckout(subtotal: number, deliveryFee: number, code?: string) {
  const result = code ? await validateCoupon(code, subtotal) : { valid: false, discountTotal: 0 };
  return {
    subtotal,
    discountTotal: result.discountTotal,
    deliveryFee,
    grandTotal: calculateGrandTotal(subtotal, result.discountTotal, deliveryFee),
  };
}
