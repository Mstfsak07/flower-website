/**
 * Online kart odemesi bayragi. Varsayilan: KAPALI (pasif).
 * Odeme saglayicisi (iyzico/PayTR) baglandiginda .env dosyasina
 *   NEXT_PUBLIC_ONLINE_PAYMENT_ENABLED=true
 * eklenerek acilir. Kapaliyken kart secenegi "Yakinda" gorunur ve sunucu kart siparisini reddeder.
 */
export const onlinePaymentEnabled = process.env.NEXT_PUBLIC_ONLINE_PAYMENT_ENABLED === "true";
