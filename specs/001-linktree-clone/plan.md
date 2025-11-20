# Implementation Plan: Linktree Clone with Virtual Card Commerce

**Branch**: `001-linktree-clone` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-linktree-clone/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Building a Linktree-style platform with advanced link management (shortening, QR codes, analytics) and e-commerce capabilities for selling virtual cards. The application combines link-in-bio pages, Bitly-like URL shortening, customizable QR code generation, and a virtual card marketplace with Glide-inspired minimalist UI.

**Technical Approach**: Monolithic full-stack application using AdonisJS 6 with Inertia.js for seamless server-client integration, React for rich interactivity, and TypeScript for type safety across the entire stack.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Node.js 20 LTS)
**Primary Dependencies**:
- **Backend**: AdonisJS 6.x (web framework with built-in ORM, auth, validation)
- **Frontend**: React 18.x with Inertia.js 1.x (SPA-like experience without API)
- **UI**: ShadcnUI + Tailwind CSS 3.x + Radix UI primitives
- **Database ORM**: Lucid ORM (AdonisJS native)

**Storage**: PostgreSQL 15+ (hosted on Neon with serverless autoscaling and instant branching)

**Testing**:
- Backend: Japa (AdonisJS native test runner) with functional and unit tests
- Frontend: Vitest + React Testing Library for component tests
- E2E: Playwright for critical user flows

**Target Platform**: Web application (Railway deployment + Neon PostgreSQL with automatic HTTPS, zero-config deployment)

**Project Type**: Web (Inertia.js monolith - single deployment unit serving both server-rendered and client-side React)

**Performance Goals**:
- Landing page load: <1s (90th percentile on 4G)
- Link redirection: <200ms average globally
- QR code generation: <5s
- Support 1,000 concurrent users without degradation

**Constraints**:
- Response time: <200ms p95 for API endpoints
- Database queries: <50ms for dashboard views
- Image uploads: Max 5MB for profile images, 2MB for QR logos
- Railway free tier limits: 500MB RAM, shared CPU (upgrade path for production)
- Neon free tier: 0.5GB storage, 100 compute hours/month, 100 pooled connections

**Scale/Scope**:
- MVP target: 1,000 active landing pages in 3 months
- Analytics retention: 12 months for free users, unlimited for premium
- Expected load: 10k+ monthly visitors per power user
- Database growth: ~100GB in first year (users, links, analytics events)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: DEFERRED - Constitution template not yet filled. Proceeding with standard best practices:
- TypeScript strict mode enforcement
- Test coverage targets (>80% for business logic)
- Code review requirements before merge
- Security audit for payment processing
- GDPR compliance for analytics data

**Post-Design Re-check**: Required after Phase 1 to validate architecture against project principles.

## Project Structure

### Documentation (this feature)

```text
specs/001-linktree-clone/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── controllers/
│   ├── auth_controller.ts           # Registration, login, OAuth
│   ├── pages_controller.ts          # Landing page CRUD
│   ├── links_controller.ts          # Link shortening & management
│   ├── analytics_controller.ts      # Click tracking & reporting
│   ├── qr_codes_controller.ts       # QR generation & customization
│   ├── products_controller.ts       # Virtual card marketplace
│   └── orders_controller.ts         # Purchase flow & fulfillment
├── models/
│   ├── user.ts
│   ├── landing_page.ts
│   ├── link.ts
│   ├── click_event.ts
│   ├── qr_code.ts
│   ├── product.ts
│   └── order.ts
├── services/
│   ├── link_shortener_service.ts    # URL shortening logic
│   ├── qr_generator_service.ts      # QR code creation with customization
│   ├── analytics_service.ts         # Click tracking & aggregation
│   ├── payment_service.ts           # Stripe integration
│   └── email_service.ts             # Order confirmations, activation links
├── validators/
│   ├── auth_validator.ts
│   ├── page_validator.ts
│   ├── link_validator.ts
│   └── product_validator.ts
├── middleware/
│   ├── auth.ts                      # Session authentication
│   ├── rate_limiter.ts              # Abuse prevention
│   └── analytics_tracker.ts         # Click event capture
└── exceptions/
    ├── link_collision_exception.ts
    └── invalid_url_exception.ts

database/
├── migrations/
│   ├── 001_create_users_table.ts
│   ├── 002_create_landing_pages_table.ts
│   ├── 003_create_links_table.ts
│   ├── 004_create_click_events_table.ts
│   ├── 005_create_qr_codes_table.ts
│   ├── 006_create_products_table.ts
│   └── 007_create_orders_table.ts
└── seeders/
    └── demo_data_seeder.ts

inertia/
├── pages/
│   ├── auth/
│   │   ├── register.tsx             # Sign up form
│   │   └── login.tsx                # Login form
│   ├── dashboard/
│   │   ├── index.tsx                # Main dashboard (Glide-inspired)
│   │   ├── editor.tsx               # Landing page editor with live preview
│   │   └── analytics.tsx            # Analytics dashboard with charts
│   ├── links/
│   │   ├── index.tsx                # Shortened links list
│   │   └── create.tsx               # Link shortening form
│   ├── qr/
│   │   ├── generate.tsx             # QR code customization editor
│   │   └── download.tsx             # QR code export options
│   ├── shop/
│   │   ├── index.tsx                # Virtual card marketplace
│   │   └── checkout.tsx             # Payment flow (Stripe)
│   ├── orders/
│   │   └── index.tsx                # Seller order management
│   └── public/
│       └── [slug].tsx               # Public landing page view
├── components/
│   ├── ui/                          # ShadcnUI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── chart.tsx                # Recharts for analytics
│   │   └── ...
│   ├── landing-page/
│   │   ├── link-list.tsx            # Drag-and-drop link list
│   │   ├── theme-customizer.tsx     # Color/font picker
│   │   └── live-preview.tsx         # Real-time preview panel
│   ├── analytics/
│   │   ├── click-chart.tsx          # Time-series chart
│   │   ├── geo-map.tsx              # Geographic distribution
│   │   └── device-breakdown.tsx     # Device type pie chart
│   └── qr/
│       ├── qr-editor.tsx            # QR customization UI
│       └── qr-preview.tsx           # Real-time QR preview
├── layouts/
│   ├── auth_layout.tsx              # Minimal layout for auth pages
│   ├── dashboard_layout.tsx         # Main app layout with nav
│   └── public_layout.tsx            # Clean layout for public pages
└── lib/
    ├── utils.ts                     # Tailwind cn() utility
    └── api-client.ts                # Inertia form helpers

tests/
├── functional/
│   ├── auth/
│   │   ├── registration.spec.ts
│   │   └── login.spec.ts
│   ├── pages/
│   │   ├── create_page.spec.ts
│   │   └── customize_page.spec.ts
│   ├── links/
│   │   ├── shorten_link.spec.ts
│   │   └── redirect.spec.ts
│   ├── analytics/
│   │   └── track_click.spec.ts
│   ├── qr/
│   │   └── generate_qr.spec.ts
│   └── shop/
│       ├── create_product.spec.ts
│       └── purchase_flow.spec.ts
├── unit/
│   ├── services/
│   │   ├── link_shortener_service.spec.ts
│   │   ├── qr_generator_service.spec.ts
│   │   └── analytics_service.spec.ts
│   └── models/
│       └── user.spec.ts
└── e2e/
    ├── landing_page_creation.spec.ts
    ├── link_shortening.spec.ts
    └── virtual_card_purchase.spec.ts

public/
├── uploads/
│   ├── profiles/                    # User profile images
│   └── qr-logos/                    # Uploaded QR code logos
└── qr-codes/                        # Generated QR code files

config/
├── database.ts                      # PostgreSQL connection (Neon via DATABASE_URL)
├── auth.ts                          # Session + OAuth config
├── inertia.ts                       # Inertia.js settings
└── stripe.ts                        # Payment processor config

start/
├── routes.ts                        # All application routes
└── kernel.ts                        # Middleware registration

.env.example                         # Environment template
railway.toml                         # Railway deployment config
package.json                         # Dependencies
tsconfig.json                        # TypeScript configuration
tailwind.config.js                   # Tailwind + ShadcnUI setup
vite.config.ts                       # Inertia asset bundling
```

**Structure Decision**: Monolithic Inertia.js application structure (Option 2 variant) where:
- `app/` contains all AdonisJS backend code (controllers, models, services)
- `inertia/` contains all React frontend code (pages, components, layouts)
- Single deployment unit with Inertia bridging server and client
- No separate API layer needed (Inertia handles data transmission)
- Assets built with Vite and served through AdonisJS static file handler

**Key Architectural Choices**:
1. **Inertia.js Pattern**: Server-side routing with client-side transitions (SPA UX without REST API complexity)
2. **Shared Types**: TypeScript types shared between controllers and React components via Inertia props
3. **Asset Pipeline**: Vite for fast HMR during development, optimized bundles for production
4. **Database Strategy**: Lucid ORM with migrations for schema management via Neon, seeders for demo data
5. **File Storage**: Local filesystem for development, Railway Volumes or S3 for production QR codes/uploads
6. **Neon Branching**: Separate database branches for development, staging, and production environments

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations identified - constitution not yet established. Standard web application architecture.*
