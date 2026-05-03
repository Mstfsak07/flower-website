# Ödeme ve Checkout Entegrasyon Notları

## 1. Veritabanı ve Sipariş Kalıcılığı (Persistence)
Sipariş oluşturma (checkout) operasyonları, daha önce bir "demo store" mekanizması kullanılarak geçici belleğe kaydedilebiliyorken, artık doğrudan Prisma üzerinden **veritabanına yazılacak** şekilde güçlendirilmiştir.
- Sipariş oluşturma (POST `/api/orders`) sırasında veritabanı yazma işlemi başarısız olursa, demo belleğe düşmek yerine sistem `500 Internal Server Error` döndürerek siparişin tutarsız bir şekilde kaydedilmesini engeller.
- Sipariş takibi (GET `/api/orders/[orderNumber]/track`) sadece veritabanındaki siparişleri ve veritabanı erişimi üzerinden döner.

## 2. Payment Provider Facade (Ödeme Sağlayıcı Altyapısı)
Ödeme altyapısı `src/lib/services/payment-service.ts` dosyasında bir "Facade" (soyutlama) kullanılarak tasarlanmıştır. Bu sistem şu anda **IYZICO**, **PAYTR** veya **MOCK** (demo için) sağlayıcılarını destekler.

### Sağlayıcı Değiştirme
Ödeme sağlayıcısını değiştirmek veya canlıya almak için projenin `.env` dosyasında aşağıdaki ayarları yapmalısınız:
```env
NEXT_PUBLIC_PAYMENT_PROVIDER=IYZICO  # veya PAYTR
# Iyzico Ayarları
IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key
IYZICO_WEBHOOK_SECRET=shared_secret_for_callback
# PayTR Ayarları
PAYTR_MERCHANT_ID=your_merchant_id
PAYTR_MERCHANT_KEY=your_merchant_key
PAYTR_MERCHANT_SALT=your_merchant_salt
PAYTR_CALLBACK_TOKEN=expected_callback_token
```

### Ödeme Oturumu (Session) Oluşturma
Kullanıcı ödeme yapacağı zaman, `createPaymentSession` metodu kullanılarak ödeme sağlayıcısından bir yönlendirme adresi (`redirectUrl`) veya iframe HTML/Token bilgisi alınmalıdır.
Bu işlem, sipariş veritabanına başarıyla kaydedildikten hemen sonra `/api/orders` route'u içerisinde çalışır.

## 3. Webhook ve Callback İşlemleri
Ödeme işleminin sonucunu (başarılı/başarısız) asenkron olarak almak için bir Webhook (Callback) adresi eklenmiştir:
- **Dosya Yolu:** `src/app/api/webhooks/payment/route.ts`
- **Görev:** Ödeme sağlayıcısının (örn. Iyzico veya PayTR) arka planda gönderdiği POST isteğini karşılar.

### Provider Entegrasyonu İpuçları:
- **Güvenlik (Signature/Hash Check):** Webhook route artık production’da sağlayıcıya göre temel imza/token doğrulaması bekler. Iyzico için `IYZICO_WEBHOOK_SECRET`, PayTR için `PAYTR_CALLBACK_TOKEN` tanımlanmalıdır.
- **Sipariş Durumu Güncelleme:** Webhook içerisinde gelen referans koduyla (orderNumber veya merchant_oid) sipariş bulunur. Ödeme başarılıysa siparişin `paymentStatus` durumu `"PAID"`, `status` durumu `"PAID"` olarak güncellenir.
- **Yanıt:** PayTR genellikle string olarak `"OK"`, Iyzico ise standart `200 OK` HTTP cevabı bekler. Bu husus webhook içerisinde yorum satırlarıyla detaylandırılmıştır.

## 4. İleriki Adımlar
1. Kullanılacak spesifik ödeme sağlayıcısı için `payment-service.ts` içerisine sağlayıcı SDK'larını (`iyzipay` vb.) dahil edin ve asıl `createPaymentSession` API çağrılarını entegre edin.
2. `webhooks/payment/route.ts` dosyasındaki imza (signature validation) kontrollerini aktif edin ve kendi `MERCHANT_KEY` bilgilerinize göre doğrulama yapın.
3. Gerekirse ödeme sonrası front-end yönlendirmesi için "Başarılı" / "Başarısız" dönüş sayfalarını özelleştirin (`/odeme/basarili`, `/odeme/hata`).
