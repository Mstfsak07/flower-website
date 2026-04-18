# Deployment Notes

## Required Environment

- `DATABASE_URL` for PostgreSQL
- `ADMIN_SECRET` for protecting `/api/admin/*`
- `NEXT_PUBLIC_PAYMENT_PROVIDER`
- provider credentials for payment and mail

## Production Checklist

1. Set `DATABASE_URL` and run:
   - `npm run prisma:generate`
   - `npm run prisma:seed` only for non-production demo datasets
2. Set `ADMIN_SECRET` so admin APIs stop running in open demo mode.
3. Switch payment provider from `MOCK` to `IYZICO` or `PAYTR`.
4. Switch mail provider from `mock` to `SMTP` or `RESEND`.
5. Deploy on Vercel with Node runtime and validate:
   - `npm run build`
   - `npm run test:e2e`

## Runtime Behaviour

- No `DATABASE_URL`: repository layer falls back to typed demo data.
- With `DATABASE_URL`: repository layer starts reading from Prisma-backed tables.
- No `ADMIN_SECRET`: local demo mode keeps admin API open.
