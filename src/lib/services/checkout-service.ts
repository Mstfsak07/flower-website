import { coupons, deliveryZones } from "@/lib/data";
import type { CheckoutPayload } from "@/lib/types";
import { calculateCouponDiscount, calculateGrandTotal } from "@/lib/commerce";

export function validateCheckout(payload: CheckoutPayload) {
  const zone = deliveryZones.find(
    (entry) =>
      entry.city.toLocaleLowerCase("tr-TR") === payload.city.toLocaleLowerCase("tr-TR") &&
      entry.district.toLocaleLowerCase("tr-TR") === payload.district.toLocaleLowerCase("tr-TR"),
  );

  return {
    deliveryZone: zone ?? null,
    supportsSameDay: Boolean(zone?.sameDayAvailable),
    paymentOptions: ["CARD", "BANK_TRANSFER", "CASH_ON_DELIVERY"],
  };
}

export function validateCoupon(code: string, subtotal: number) {
  const coupon = coupons.find((entry) => entry.code === code);
  if (!coupon) {
    return { valid: false, discountTotal: 0, reason: "Coupon not found" };
  }

  const discountTotal = calculateCouponDiscount(subtotal, coupon);
  if (!discountTotal) {
    return { valid: false, discountTotal: 0, reason: "Minimum amount not reached" };
  }

  return { valid: true, discountTotal, coupon };
}

export function summarizeCheckout(subtotal: number, deliveryFee: number, code?: string) {
  const result = code ? validateCoupon(code, subtotal) : { valid: false, discountTotal: 0 };
  return {
    subtotal,
    discountTotal: result.discountTotal,
    deliveryFee,
    grandTotal: calculateGrandTotal(subtotal, result.discountTotal, deliveryFee),
  };
}
