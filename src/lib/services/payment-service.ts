/**
 * Payment service abstraction.
 *
 * Behaviour:
 *  - MOCK (default when no env var is set): returns instant SUCCESS — safe for local demo.
 *  - IYZICO / PAYTR: builds a session struct and returns a redirect URL.
 *    The actual API call to the provider must be wired here when credentials are available.
 *
 * To activate a real provider set:
 *   NEXT_PUBLIC_PAYMENT_PROVIDER=IYZICO   (or PAYTR)
 *   IYZICO_API_KEY / IYZICO_SECRET_KEY
 *   PAYTR_MERCHANT_ID / PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT
 */

export type PaymentProvider = "IYZICO" | "PAYTR" | "MOCK";

export type PaymentSession = {
  provider: PaymentProvider;
  transactionId: string;
  redirectUrl?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
};

export type CreatePaymentInput = {
  provider: PaymentProvider;
  orderNumber: string;
  amount: number;
  /** Customer email — forwarded to provider where required */
  customerEmail?: string;
};

export function resolvePaymentProvider(): PaymentProvider {
  const raw = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER;
  if (raw === "IYZICO" || raw === "PAYTR") return raw;
  return "MOCK";
}

export function createPaymentSession(input: CreatePaymentInput): PaymentSession {
  if (input.provider === "MOCK") {
    return {
      provider: "MOCK",
      transactionId: `mock_${input.orderNumber}`,
      status: "SUCCESS",
    };
  }

  // Real provider: build a session object.
  // Redirect to the payment page; the provider callback will update payment status.
  // Wire real API calls here when credentials are configured.
  return {
    provider: input.provider,
    transactionId: `${input.provider.toLowerCase()}_${input.orderNumber}`,
    redirectUrl: `/odeme?provider=${input.provider.toLowerCase()}&session=${input.orderNumber}`,
    status: "PENDING",
  };
}

/** Returns true when a configured (non-mock) provider is active */
export function isRealPaymentProvider(): boolean {
  return resolvePaymentProvider() !== "MOCK";
}
