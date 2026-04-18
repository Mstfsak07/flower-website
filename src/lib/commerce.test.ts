import { describe, expect, it } from "vitest";

import { coupons, deliveryZones } from "./data";
import {
  calculateCouponDiscount,
  calculateGrandTotal,
  calculateSubtotal,
  isSameDayAvailable,
} from "./commerce";

describe("commerce helpers", () => {
  it("calculates subtotal from cart items", () => {
    expect(
      calculateSubtotal([
        { id: "1", productId: "p1", quantity: 2, unitPrice: 100 },
        { id: "2", productId: "p2", quantity: 1, unitPrice: 250 },
      ]),
    ).toBe(450);
  });

  it("applies percentage coupon with cap", () => {
    expect(calculateCouponDiscount(3000, coupons[0])).toBe(200);
  });

  it("returns zero when coupon minimum is not reached", () => {
    expect(calculateCouponDiscount(500, coupons[0])).toBe(0);
  });

  it("checks same-day cutoff by delivery zone", () => {
    expect(isSameDayAvailable(14, deliveryZones[0])).toBe(true);
    expect(isSameDayAvailable(17, deliveryZones[0])).toBe(false);
  });

  it("calculates grand total correctly", () => {
    expect(calculateGrandTotal(1000, 100, 90)).toBe(990);
  });
});
