PROJECT: cicekci-platform
OWNER: Claude Sonnet
SCOPE: backend/auth/data/services only

You are not alone in the codebase. Do not revert edits made by others. Stay within your owned files and adapt to concurrent changes.

Write scope:
- prisma/**
- src/app/api/**
- src/lib/services/**
- src/lib/schemas.ts
- src/emails/**
- docs/** if needed for backend notes

Do not edit these unless absolutely required:
- src/app/page.tsx
- src/components/premium-hero.tsx
- src/components/motion/**
- public storefront visual components

Task:
Take the existing Next.js flower marketplace MVP and push it closer to production on the backend/integration side.

Priority work:
1. Replace obvious mock-only backend gaps with stronger server-side structure while still remaining runnable locally.
2. Improve API consistency and validation, especially admin endpoints and order/checkout/coupon flows.
3. Add a lightweight auth guard pattern for admin API/routes that is config-based and does not break local demo usage.
4. Strengthen payment abstraction and email dispatch structure so a real provider can be plugged in later.
5. Improve Prisma seed/schema consistency if needed.
6. Add any missing helper code/tests/docs that materially improve backend readiness.

Constraints:
- Keep the app building and tests passing.
- Prefer minimal, high-signal changes over speculative architecture.
- If you add environment-driven behavior, make it safe by default for local demo mode.
- Avoid changing visual storefront behavior unless required by backend correctness.

Acceptance:
- `npm run build` should still pass.
- API surface should be more coherent than before.
- Admin/backend readiness should clearly improve.

At the end, print:
1. files changed
2. concise summary
3. verification you ran
