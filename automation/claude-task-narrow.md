PROJECT: cicekci-platform
OWNER: Claude Sonnet
SCOPE: narrow backend hardening

You are not alone in the codebase. Do not revert edits made by others. Respect existing changes.

Write scope:
- src/lib/services/**
- src/app/api/admin/**
- src/app/api/checkout/validate/route.ts
- src/app/api/coupons/validate/route.ts
- src/app/api/orders/route.ts
- src/lib/schemas.ts
- docs/**
- create `.env.example` if useful

Do not edit storefront visual files.

Task:
Make a small but real backend-hardening pass.

Required outcomes:
1. Add a simple config-driven admin guard/helper for admin API routes.
2. Keep local demo mode usable by default.
3. Tighten API responses and validation where clearly useful.
4. Add `.env.example` with the important variables.
5. Add a short backend readiness note in docs if needed.

Keep this bounded. Do not attempt a full auth system. Do not change the visual storefront.

At the end, print:
1. files changed
2. concise summary
3. verification you ran
