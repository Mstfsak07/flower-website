# GCP Runbook

Bu dosya `BeachGo` reposundaki Cloud Run operasyon yaklaşımının `cicekci-platform` için uyarlanmış halidir.

## Kullanılacak GCP Servisleri

- Cloud Run
- Cloud Build
- Artifact Registry
- Secret Manager
- Cloud SQL
- Cloud Logging
- Cloud Monitoring
- Domain Mapping

## Önerilen Proje Yapısı

- Google hesabı: mevcut hesabın
- Yeni GCP project: `cicekci-platform` için ayrı
- Artifact Registry repo: `cicekci-platform`
- Cloud Run service: `cicekci-web`
- Cloud SQL instance: PostgreSQL

## Gerekli API'ler

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com
```

## Artifact Registry

```bash
gcloud artifacts repositories create cicekci-platform \
  --repository-format=docker \
  --location=europe-west1
```

## Secret Manager

Cloud Run ortam değişkenlerini plaintext tutma. Özellikle bunları secret olarak bağla:

- `DATABASE_URL`
- `AUTH_SESSION_SECRET`
- `ADMIN_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RESEND_API_KEY`
- `MAIL_FROM`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- ödeme sağlayıcı secret'ları varsa onlar

Örnek:

```bash
printf "re_xxx" | gcloud secrets create RESEND_API_KEY --data-file=-
printf "postgresql://..." | gcloud secrets create DATABASE_URL --data-file=-
```

Yeni versiyon eklemek için:

```bash
printf "yeni-deger" | gcloud secrets versions add RESEND_API_KEY --data-file=-
```

## Cloud Build

Bu repo kökünde `cloudbuild.frontend.yaml` var.

Build:

```bash
gcloud builds submit --config cloudbuild.frontend.yaml .
```

## Cloud Run Deploy

```bash
gcloud run deploy cicekci-web \
  --image europe-west1-docker.pkg.dev/PROJECT_ID/cicekci-platform/cicekci-web:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-secrets DATABASE_URL=DATABASE_URL:latest \
  --set-secrets AUTH_SESSION_SECRET=AUTH_SESSION_SECRET:latest \
  --set-secrets ADMIN_SECRET=ADMIN_SECRET:latest \
  --set-secrets ADMIN_EMAIL=ADMIN_EMAIL:latest \
  --set-secrets ADMIN_PASSWORD=ADMIN_PASSWORD:latest \
  --set-secrets RESEND_API_KEY=RESEND_API_KEY:latest \
  --set-secrets MAIL_FROM=MAIL_FROM:latest
```

İhtiyaca göre ekle:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `IYZICO_*`
- `PAYTR_*`

Plaintext kalabilecekler:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- `MAIL_PROVIDER=RESEND`
- `NEXT_PUBLIC_PAYMENT_PROVIDER=MOCK` veya gerçek sağlayıcı
- `DEPLOYMENT_ID` revision bazlı değer

## Cloud SQL

Bu proje Prisma/PostgreSQL kullanıyor. Production için Cloud SQL PostgreSQL önerilir.

Öneri:

- Cloud SQL private/public erişimini bilinçli seç
- runtime service account'a sadece `roles/cloudsql.client` ver
- connection string Secret Manager’da dursun

## Service Account Hardening

`BeachGo` tarafındaki yaklaşım burada da aynı olmalı:

- Runtime service account'a `Owner` verme
- Project-level geniş `Secret Manager Accessor` verme
- Secret erişimlerini mümkünse secret bazında ver
- Artifact Registry writer rolü runtime service account'ta değil, build tarafında olsun

Minimum runtime yaklaşımı:

- `roles/run.viewer` gerekmez
- `roles/cloudsql.client`
- secret bazlı `roles/secretmanager.secretAccessor`

## Domain Mapping

Cloud Run custom domain bağlanacaksa:

- `www` ve kök domain için ayrı plan yap
- DNS kayıtları Cloud Run’ın verdiği değerlere göre girilmeli
- SSL `CertificatePending` durumunu Cloud Logging / Console’dan kontrol et

## Güvenlik Notları

Bu repo zaten app tarafında şunları kullanıyor:

- signed cookie session
- admin route guard
- account route guard
- temel güvenlik header’ları `proxy.ts` içinde

Cloud Run tarafında da korunmalı:

- secret’ları env dosyasıyla deploy etme
- production `AUTH_SESSION_SECRET` zorunlu olsun
- `ADMIN_SECRET` boş bırakma
- loglara plaintext connection string düşürme

## Operasyon Checklist

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `gcloud builds submit --config cloudbuild.frontend.yaml .`
- `gcloud run deploy cicekci-web ...`
- smoke:
  - `/`
  - `/giris`
  - `/hesabim`
  - `/api/auth/session`
  - register -> verify email -> login

## BeachGo'dan Bilinçli Olarak Taşınmayanlar

Bu repo farklı stack olduğu için aşağıdakiler kopyalanmadı:

- `.NET backend` Dockerfile/Cloud Build
- JWT blacklist middleware
- .NET rate limiter config
- Stripe webhook controller akışı
- mobile / beach-specific ops scriptleri

Taşınan mantık:

- Cloud Run + Artifact Registry + Secret Manager yolu
- runbook disiplini
- least-privilege service account yaklaşımı
- deploy sonrası smoke kontrol mantığı
