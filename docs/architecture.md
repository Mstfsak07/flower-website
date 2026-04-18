# Cicekci MVP Architecture

## Route Map

- `/`: landing page, hero, featured products, FAQ
- `/kategori/[slug]`: category listing
- `/urun/[slug]`: product detail and add-to-cart
- `/sepet`: cart review
- `/odeme`: checkout
- `/siparis-basarili`: success state
- `/siparis-takip`: order lookup
- `/toptan`: wholesale intake
- `/admin/*`: operational dashboard and CRUD surfaces

## Domain Modules

- `catalog`: categories, products, variants, merchandising
- `cart`: local cart storage and quantity management
- `checkout`: address, delivery, payment selection and order creation
- `orders`: tracking and admin visibility
- `wholesale`: intake form and admin pipeline
- `content`: legal pages and SEO content
- `motion`: reveal, tilt, parallax-safe visual helpers
- `visual-config`: motion intensity, glass UI and hero variants

## ER Summary

- `User -> Address`
- `User -> Order`
- `Category -> Product`
- `Product -> ProductImage`
- `Product -> ProductVariant`
- `Product -> ProductOption -> ProductOptionValue`
- `Order -> OrderItem`
- `Coupon` applies to `Order`
- `WholesaleInquiry` runs parallel to the order flow

## Notes

- MVP uses typed mock data plus local storage for interaction speed.
- Prisma schema is ready for PostgreSQL migration.
- Payment, auth and storage are kept abstract so iyzico/PayTR, Clerk/NextAuth and S3-style media can be attached later.
- Phase 1 intentionally avoids heavy real-time 3D in checkout/admin flows.
- Premium storefront uses glass panels, layered backgrounds and reduced-motion friendly animation primitives.
- `services/*` abstracts catalog, checkout, visual config, payment and mail responsibilities.
- Playwright specs cover storefront, reduced-motion and admin visual-config visibility.
