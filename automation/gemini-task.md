PROJECT: cicekci-platform
OWNER: Gemini
SCOPE: storefront/ui/motion/content polish only

You are not alone in the codebase. Do not revert edits made by others. Stay within your owned files and adapt to concurrent changes.

Write scope:
- src/app/page.tsx
- src/app/kategori/**
- src/app/urun/**
- src/app/toptan/**
- src/components/premium-hero.tsx
- src/components/motion/**
- src/components/category-card.tsx
- src/components/product-card.tsx
- src/components/section-heading.tsx
- src/components/site-header.tsx
- src/components/site-footer.tsx
- src/app/globals.css

Do not edit these unless absolutely required:
- prisma/**
- src/app/api/**
- src/lib/services/**
- backend/auth/payment/mail logic

Task:
Take the existing premium floral storefront and polish it further in line with the updated product brief.

Priority work:
1. Make the homepage feel more premium and editorial without becoming noisy.
2. Improve category and product presentation with better visual hierarchy and motion restraint.
3. Keep checkout/admin/auth simple; focus on storefront-facing surfaces.
4. Strengthen the Apple Vision Pro-inspired floral feeling using glass layers, spacing, typography, and subtle motion.
5. Maintain reduced-motion friendliness and performance-aware behavior.
6. Improve copy where the current text feels placeholder or flat.

Constraints:
- No heavy 3D requirement; keep it 3D-ready, not 3D-heavy.
- Avoid breaking existing routes and E2E flows.
- Do not add unnecessary dependencies.
- Keep changes tasteful and intentional, not generic template polish.

Acceptance:
- storefront should look more deliberate and premium
- no regression in usability
- `npm run build` should still pass

At the end, print:
1. files changed
2. concise summary
3. verification you ran
