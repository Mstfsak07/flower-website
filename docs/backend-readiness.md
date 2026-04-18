# Backend Readiness Notes

## Current State (MVP)

All routes read from **typed in-memory seed data** (`src/lib/data`). No database queries are performed. Orders are created in-memory and not persisted across requests.

## Admin Guard

Admin API routes (`/api/admin/**`) are protected by a config-driven bearer token check in `src/lib/admin-guard.ts`.

| `ADMIN_SECRET` env var | Behaviour |
|---|---|
| Not set in development/test (default) | All admin requests allowed — safe for local demo and CI |
| Not set in production | All admin requests denied with 401 |
| Set to any non-empty string | Requests must supply `Authorization: Bearer <ADMIN_SECRET>` — returns 401 otherwise |

This is intentionally minimal. A full session-based auth system (Clerk, NextAuth, etc.) can be dropped in later without changing route structure.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need:

```bash
cp .env.example .env.local
```

Key variables:

| Variable | Default | Purpose |
|---|---|---|
| `ADMIN_SECRET` | *(unset)* | Bearer token for admin API routes |
| `NEXT_PUBLIC_PAYMENT_PROVIDER` | `MOCK` | `IYZICO`, `PAYTR`, or `MOCK` |
| `MAIL_PROVIDER` | `mock` | `SMTP`, `RESEND`, or `mock` |
| `DATABASE_URL` | *(unset)* | PostgreSQL — not active until Prisma migration |

## Activating Real Providers

### Payment
Set `NEXT_PUBLIC_PAYMENT_PROVIDER=IYZICO` (or `PAYTR`) and the corresponding credentials in `.env.local`. Then wire the actual API call in `src/lib/services/payment-service.ts` where the stub comment lives.

### Mail
Set `MAIL_PROVIDER=SMTP` (or `RESEND`) and the corresponding credentials. Then wire the transport in `src/lib/services/mail-service.ts`.

### Database
The Prisma schema (`prisma/schema.prisma`) is ready for PostgreSQL. Set `DATABASE_URL` and run:

```bash
npx prisma migrate deploy
npx prisma generate
```

Then replace the seed-data reads in routes with Prisma client calls.

## Validation

All public API inputs are validated with Zod schemas in `src/lib/schemas.ts`. Fields have explicit upper bounds (max lengths, max numeric values) to prevent oversized payloads from reaching service logic. All routes also guard against malformed JSON with a `try/catch` around `request.json()`.
