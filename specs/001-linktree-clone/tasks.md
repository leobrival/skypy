# Tasks: Linktree Clone with Virtual Card Commerce

**Input**: Design documents from `/specs/001-linktree-clone/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL in this implementation - focus on working features first

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is an AdonisJS 6 + Inertia.js monolithic web application:
- **Backend**: `app/` (controllers, models, services, validators, middleware)
- **Frontend**: `inertia/` (pages, components, layouts)
- **Database**: `database/` (migrations, seeders)
- **Tests**: `tests/` (functional, unit, e2e)
- **Config**: `config/` (database, auth, inertia, stripe)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize AdonisJS 6 project with Inertia+React preset: `npm init adonisjs@latest skypy -- -K=inertia --auth-guard=session --db=postgres`
- [ ] T002 [P] Install UI dependencies: `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select class-variance-authority clsx tailwind-merge lucide-react recharts @dnd-kit/core @dnd-kit/sortable`
- [ ] T003 [P] Install backend dependencies: `npm install nanoid qrcode sharp stripe @adonisjs/mail @adonisjs/ally ua-parser-js maxmind`
- [ ] T004 [P] Install dev dependencies: `npm install -D @biomejs/biome @playwright/test`
- [ ] T005 Initialize ShadcnUI: `npx shadcn-ui@latest init` (TypeScript, Default style, Slate color, CSS variables)
- [ ] T006 [P] Add ShadcnUI components: `npx shadcn-ui@latest add button input card dialog select label dropdown-menu avatar badge tabs form table chart`
- [ ] T007 Create directory structure: `mkdir -p app/services app/exceptions inertia/components/{landing-page,analytics,qr} public/uploads/{profiles,qr-logos} public/qr-codes`
- [ ] T008 Configure Biome linting in `biome.json` with tabs, double quotes, and organize imports
- [ ] T009 [P] Configure Tailwind with ShadcnUI theme in `tailwind.config.js`
- [ ] T010 [P] Create `.env` file from quickstart.md template with Neon DATABASE_URL, Stripe, OAuth, email credentials
- [ ] T011 [P] Configure Railway deployment in `railway.toml` with build and deploy settings
- [ ] T012 Create Neon project at https://neon.tech, create database "skypy_dev", copy pooled connection string to `.env`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Create UUID extension migration in `database/migrations/000_add_uuid_extension.ts`: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` (Neon supports UUID natively)
- [ ] T014 [P] Create users table migration in `database/migrations/001_create_users_table.ts` with email, username, password_hash, profile_image_url, account_tier, email_verified_at
- [ ] T015 [P] Create User model in `app/models/user.ts` with Lucid ORM, auth hooks, and relationships
- [ ] T016 Configure session auth in `config/auth.ts` with web guard and Lucid provider
- [ ] T017 [P] Configure OAuth in `config/ally.ts` for Google and GitHub with env variables
- [ ] T018 [P] Create auth middleware in `app/middleware/auth.ts` for session validation
- [ ] T019 [P] Create guest middleware in `app/middleware/guest.ts` to redirect authenticated users
- [ ] T020 [P] Create rate limiter middleware in `app/middleware/rate_limiter.ts` with configurable limits
- [ ] T021 Configure email service in `config/mail.ts` with SMTP settings from env
- [ ] T022 Configure Stripe in `config/stripe.ts` with secret key, webhook secret, publishable key from env
- [ ] T023 Create base Inertia layout in `inertia/layouts/app_layout.tsx` with navigation and user menu
- [ ] T024 [P] Create auth layout in `inertia/layouts/auth_layout.tsx` for minimal login/register pages
- [ ] T025 [P] Create public layout in `inertia/layouts/public_layout.tsx` for landing pages
- [ ] T026 Create utilities in `inertia/lib/utils.ts` with `cn()` for Tailwind class merging
- [ ] T027 Run migrations on Neon: `node ace migration:run` (ensure DATABASE_URL points to Neon pooled connection)

**Checkpoint**: Foundation ready (Neon database configured, migrations applied) - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Personal Landing Page (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, create link-in-bio pages with multiple links, customize appearance, and share unique URLs

**Independent Test**: Create account → Add 3-5 links → Customize theme → Verify public page renders with all links clickable

### Authentication & User Management

- [ ] T028 [P] [US1] Create AuthController in `app/controllers/auth_controller.ts` with showRegister, register, showLogin, login, logout methods
- [ ] T029 [P] [US1] Create registration validator in `app/validators/auth_validator.ts` with email, username, password validation
- [ ] T030 [P] [US1] Create registration page in `inertia/pages/auth/register.tsx` with form, ShadcnUI inputs, Inertia form handling
- [ ] T031 [P] [US1] Create login page in `inertia/pages/auth/login.tsx` with email/password form
- [ ] T032 [P] [US1] Add OAuth redirect methods to AuthController for Google (redirectToGoogle, handleGoogleCallback)
- [ ] T033 [P] [US1] Add OAuth redirect methods to AuthController for GitHub (redirectToGithub, handleGithubCallback)
- [ ] T034 [P] [US1] Create email verification template and sendVerificationEmail method in AuthController
- [ ] T035 [P] [US1] Create forgot password page in `inertia/pages/auth/forgot-password.tsx`
- [ ] T036 [P] [US1] Create reset password page in `inertia/pages/auth/reset-password.tsx`
- [ ] T037 [US1] Add auth routes to `start/routes.ts`: /auth/register, /auth/login, /auth/logout, /auth/verify-email/:token, /auth/forgot-password, /auth/reset-password, OAuth routes

### Landing Page Database & Models

- [ ] T038 [P] [US1] Create landing_pages table migration in `database/migrations/002_create_landing_pages_table.ts` with user_id, slug, profile_name, bio, theme_config (JSONB), visibility, view_count
- [ ] T039 [P] [US1] Create links table migration in `database/migrations/003_create_links_table.ts` with user_id, landing_page_id, title, description, destination_url, short_code, expiration_date, click_count, position, is_active
- [ ] T040 [US1] Create LandingPage model in `app/models/landing_page.ts` with user relationship, links relationship, and JSONB casting for theme_config
- [ ] T041 [US1] Create Link model in `app/models/link.ts` with user, landingPage relationships, and validation hooks
- [ ] T042 [US1] Run new migrations: `node ace migration:run`

### Landing Page Controllers & Services

- [ ] T043 [US1] Create PagesController in `app/controllers/pages_controller.ts` with index, create, store, show, edit, update, destroy methods
- [ ] T044 [US1] Add link management methods to PagesController: addLink, updateLink, removeLink, reorderLinks (JSON responses for AJAX)
- [ ] T045 [US1] Create page validator in `app/validators/page_validator.ts` for slug, profile_name, bio, theme_config validation
- [ ] T046 [US1] Create link validator in `app/validators/link_validator.ts` for title, destination_url validation

### Landing Page Frontend (Dashboard)

- [ ] T047 [US1] Create dashboard index page in `inertia/pages/dashboard/index.tsx` with welcome message, "Create Page" CTA, and page list
- [ ] T048 [P] [US1] Create pages index page in `inertia/pages/pages/index.tsx` listing user's landing pages with edit/delete actions
- [ ] T049 [P] [US1] Create page creation form in `inertia/pages/pages/create.tsx` with slug, profile name, bio inputs
- [ ] T050 [US1] Create landing page editor in `inertia/pages/dashboard/editor.tsx` with split layout: editor (left) and live preview (right)
- [ ] T051 [P] [US1] Create LinkList component in `inertia/components/landing-page/link-list.tsx` with drag-and-drop reordering using @dnd-kit
- [ ] T052 [P] [US1] Create ThemeCustomizer component in `inertia/components/landing-page/theme-customizer.tsx` with color pickers, font selector, button style options
- [ ] T053 [P] [US1] Create LivePreview component in `inertia/components/landing-page/live-preview.tsx` that updates in real-time as user edits
- [ ] T054 [US1] Add pages routes to `start/routes.ts`: /pages (index, create, store, show, edit, update, destroy), /pages/:id/links (addLink, updateLink, removeLink, reorderLinks)

### Public Landing Page View

- [ ] T055 [US1] Create PublicPagesController in `app/controllers/public_pages_controller.ts` with show method (fetches by slug)
- [ ] T056 [US1] Create public page view in `inertia/pages/public/[slug].tsx` rendering links with theme from JSONB, clickable links, profile image
- [ ] T057 [US1] Add public routes to `start/routes.ts`: GET /:slug (public landing page view with slug validation regex)
- [ ] T058 [US1] Create homepage in `inertia/pages/home.tsx` with hero section, features, CTA to sign up

**Checkpoint**: User Story 1 complete - Users can register, create landing pages, customize themes, and share public URLs

---

## Phase 4: User Story 2 - Link Shortening & Analytics (Priority: P1)

**Goal**: Users can create shortened links, track clicks with detailed analytics (charts, geo, devices)

**Independent Test**: Create 3 shortened links → Generate clicks → Verify analytics dashboard shows accurate metrics with charts

### Link Shortening Service & Database

- [ ] T059 [P] [US2] Create click_events table migration in `database/migrations/004_create_click_events_table.ts` with link_id, timestamp, ip_hash, user_agent, referer, country, city, device_type, browser, os
- [ ] T060 [P] [US2] Create daily_aggregations table migration in `database/migrations/008_create_daily_aggregations_table.ts` for pre-aggregated analytics (link_id, date, total_clicks, unique_visitors, top_country, top_device, top_referer)
- [ ] T061 [US2] Create ClickEvent model in `app/models/click_event.ts` with link relationship
- [ ] T062 [US2] Create LinkShortenerService in `app/services/link_shortener_service.ts` with generateShortCode() using nanoid(8), collision detection retry logic
- [ ] T063 [US2] Create AnalyticsService in `app/services/analytics_service.ts` with trackClick(), aggregateDaily(), getClickStats() methods
- [ ] T064 [US2] Run new migrations: `node ace migration:run`

### Link Shortening Controllers & Middleware

- [ ] T065 [US2] Create LinksController in `app/controllers/links_controller.ts` with index, create, store, show, edit, update, destroy, redirect methods
- [ ] T066 [US2] Implement redirect method in LinksController: lookup short_code, validate expiration, redirect with 301, call AnalyticsService.trackClick()
- [ ] T067 [US2] Create analytics tracker middleware in `app/middleware/analytics_tracker.ts` to capture click events (IP hash, user agent parsing, geolocation)
- [ ] T068 [US2] Create AnalyticsController in `app/controllers/analytics_controller.ts` with index method fetching user's link stats from daily_aggregations

### Link Shortening Frontend

- [ ] T069 [P] [US2] Create links index page in `inertia/pages/links/index.tsx` listing shortened links with click counts, creation dates, edit/delete actions
- [ ] T070 [P] [US2] Create link creation form in `inertia/pages/links/create.tsx` with destination URL input, optional custom slug, expiration date picker
- [ ] T071 [P] [US2] Create link detail page in `inertia/pages/links/show.tsx` displaying short code, destination URL, click stats preview
- [ ] T072 [US2] Add links routes to `start/routes.ts`: /links (index, create, store, show, edit, update, destroy), /l/:shortCode (redirect with analytics middleware)

### Analytics Dashboard & Charts

- [ ] T073 [US2] Create analytics dashboard page in `inertia/pages/dashboard/analytics.tsx` with date range selector, overview cards (total clicks, unique visitors)
- [ ] T074 [P] [US2] Create ClickChart component in `inertia/components/analytics/click-chart.tsx` using Recharts LineChart for time-series clicks
- [ ] T075 [P] [US2] Create GeoMap component in `inertia/components/analytics/geo-map.tsx` displaying top countries with click counts (table or simple map visualization)
- [ ] T076 [P] [US2] Create DeviceBreakdown component in `inertia/components/analytics/device-breakdown.tsx` using Recharts PieChart for mobile/desktop/tablet distribution
- [ ] T077 [US2] Add analytics route to `start/routes.ts`: /dashboard/analytics
- [ ] T078 [US2] Create scheduled job in `start/scheduler.ts` to run AnalyticsService.aggregateDaily() at 2 AM daily

**Checkpoint**: User Story 2 complete - Users can shorten links and view detailed analytics with charts

---

## Phase 5: User Story 3 - QR Code Generation (Priority: P2)

**Goal**: Users can generate customizable QR codes (colors, logo) and download in multiple formats

**Independent Test**: Create landing page → Generate QR code → Customize colors/logo → Download PNG/SVG → Scan with phone → Verify redirect

### QR Code Database & Service

- [ ] T079 [P] [US3] Create qr_codes table migration in `database/migrations/005_create_qr_codes_table.ts` with link_id, customization (JSONB), file_path, format, download_count
- [ ] T080 [US3] Create QRCode model in `app/models/qr_code.ts` with link relationship and JSONB casting for customization
- [ ] T081 [US3] Create QRGeneratorService in `app/services/qr_generator_service.ts` with generateQR(url, customization) method using `qrcode` package, logo embedding with `sharp`
- [ ] T082 [US3] Run new migrations: `node ace migration:run`

### QR Code Controller

- [ ] T083 [US3] Create QRCodesController in `app/controllers/qr_codes_controller.ts` with create (show editor), generate (create file), download methods
- [ ] T084 [US3] Implement generate method: call QRGeneratorService, save file to public/qr-codes/, create QRCode record, return file URL as JSON
- [ ] T085 [US3] Implement download method: stream file from public/qr-codes/ with appropriate content-type headers

### QR Code Frontend

- [ ] T086 [US3] Create QR generation page in `inertia/pages/qr/generate.tsx` with link selector, customization editor
- [ ] T087 [P] [US3] Create QREditor component in `inertia/components/qr/qr-editor.tsx` with color pickers (foreground, background), logo upload, error correction level selector, corner style dropdown
- [ ] T088 [P] [US3] Create QRPreview component in `inertia/components/qr/qr-preview.tsx` that updates in real-time as user customizes
- [ ] T089 [US3] Create QR download page in `inertia/pages/qr/download.tsx` with format selector (PNG 1024, PNG 2048, SVG) and download button
- [ ] T090 [US3] Add QR routes to `start/routes.ts`: /qr/generate/:linkId (create, generate), /qr/download/:id

**Checkpoint**: User Story 3 complete - Users can generate and download customized QR codes

---

## Phase 6: User Story 4 - Virtual Card Product & E-commerce (Priority: P2)

**Goal**: Sellers can create virtual card products, customers can purchase via Stripe, receive activation emails

**Independent Test**: Create product listing → Complete Stripe checkout → Receive email → Activate card → Verify pre-configured landing page

### E-commerce Database & Models

- [ ] T091 [P] [US4] Create products table migration in `database/migrations/006_create_products_table.ts` with seller_id, name, description, price_cents, card_template (JSONB), preview_image_url, is_active, sales_count
- [ ] T092 [P] [US4] Create orders table migration in `database/migrations/007_create_orders_table.ts` with product_id, customer_email, amount_cents, stripe_session_id, stripe_charge_id, payment_status, fulfillment_status, activation_token, activated_at, expires_at
- [ ] T093 [US4] Create Product model in `app/models/product.ts` with seller (user) relationship, orders relationship
- [ ] T094 [US4] Create Order model in `app/models/order.ts` with product relationship
- [ ] T095 [US4] Run new migrations: `node ace migration:run`

### Payment Service & Controllers

- [ ] T096 [US4] Create PaymentService in `app/services/payment_service.ts` with createCheckoutSession(product) method using Stripe SDK
- [ ] T097 [US4] Create EmailService in `app/services/email_service.ts` with sendOrderConfirmation(order), sendActivationEmail(order) methods using AdonisJS Mail
- [ ] T098 [US4] Create ProductsController in `app/controllers/products_controller.ts` with shop (public marketplace), show, index (seller), create, store, edit, update, destroy, createCheckoutSession methods
- [ ] T099 [US4] Implement createCheckoutSession: call PaymentService, redirect to Stripe Checkout with success/cancel URLs
- [ ] T100 [US4] Create OrdersController in `app/controllers/orders_controller.ts` with index (seller orders), show, activate, refund methods
- [ ] T101 [US4] Implement activate method: validate token, mark order as activated, create/configure landing page for customer, send confirmation email
- [ ] T102 [US4] Create WebhooksController in `app/controllers/webhooks_controller.ts` with handleStripe method for checkout.session.completed event
- [ ] T103 [US4] Implement handleStripe: verify Stripe signature, create Order record, call EmailService.sendActivationEmail()

### E-commerce Frontend

- [ ] T104 [P] [US4] Create shop index page in `inertia/pages/shop/index.tsx` displaying virtual card products with preview images, prices, "Buy Now" buttons
- [ ] T105 [P] [US4] Create product show page in `inertia/pages/shop/show.tsx` with detailed description, template preview, purchase button
- [ ] T106 [P] [US4] Create products index page (seller) in `inertia/pages/products/index.tsx` listing seller's products with sales counts, edit/delete actions
- [ ] T107 [P] [US4] Create product creation form in `inertia/pages/products/create.tsx` with name, description, price, card template, preview image upload
- [ ] T108 [P] [US4] Create orders index page (seller) in `inertia/pages/orders/index.tsx` listing purchases with customer email, amount, fulfillment status, refund action
- [ ] T109 [US4] Add shop routes to `start/routes.ts`: /shop (public marketplace), /shop/:id (product detail), /shop/:id/checkout
- [ ] T110 [US4] Add products routes to `start/routes.ts`: /products (seller CRUD)
- [ ] T111 [US4] Add orders routes to `start/routes.ts`: /orders (seller dashboard), /activate/:token (public activation)
- [ ] T112 [US4] Add webhook route to `start/routes.ts`: POST /webhooks/stripe (no auth, signature verification in controller)

**Checkpoint**: User Story 4 complete - E-commerce flow functional with Stripe payments and order fulfillment

---

## Phase 7: User Story 5 - Dashboard Configuration System (Priority: P3)

**Goal**: Premium users can add custom CSS, create redirect rules, configure webhooks

**Independent Test**: Access advanced settings → Add custom CSS → Create redirect rule → Configure webhook → Verify functionality

### Advanced Configuration

- [ ] T113 [P] [US5] Add custom_css column to landing_pages table via migration in `database/migrations/009_add_advanced_features.ts`
- [ ] T114 [P] [US5] Create redirect_rules table via migration with landing_page_id, condition_type (country, device, time, referer), condition_value, redirect_url
- [ ] T115 [P] [US5] Create webhooks table via migration with user_id, url, events (JSONB array), is_active
- [ ] T116 [US5] Create RedirectRule model in `app/models/redirect_rule.ts` with landing page relationship
- [ ] T117 [US5] Create Webhook model in `app/models/webhook.ts` with user relationship
- [ ] T118 [US5] Run new migrations: `node ace migration:run`

### Advanced Features Services & Controllers

- [ ] T119 [US5] Create RedirectService in `app/services/redirect_service.ts` with evaluateRules(page, request) method checking conditions and returning redirect URL if matched
- [ ] T120 [US5] Create WebhookService in `app/services/webhook_service.ts` with sendNotification(user, event, payload) method making POST requests to user's webhook URLs
- [ ] T121 [US5] Update PublicPagesController show method to call RedirectService before rendering page
- [ ] T122 [US5] Update AnalyticsService trackClick method to call WebhookService if user has webhooks configured for click events
- [ ] T123 [US5] Add advanced settings methods to PagesController: updateCustomCSS, addRedirectRule, removeRedirectRule, configureWebhook

### Advanced Configuration Frontend

- [ ] T124 [P] [US5] Create advanced settings section in landing page editor with tabs: Custom CSS, Redirect Rules, Webhooks
- [ ] T125 [P] [US5] Create CustomCSSEditor component with code textarea and sanitization warning
- [ ] T126 [P] [US5] Create RedirectRulesManager component with rule list, add/edit/delete forms for condition-based redirects
- [ ] T127 [P] [US5] Create WebhookConfigurator component with URL input, event selector (click, view, etc.), test webhook button
- [ ] T128 [US5] Add advanced settings routes to `start/routes.ts` for custom CSS, redirect rules, webhooks management

**Checkpoint**: User Story 5 complete - Power users have advanced customization options

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T129 [P] Add indexes for performance in migration `database/migrations/010_add_performance_indexes.ts`: short_code, slug, link_id+timestamp, activation_token
- [ ] T130 [P] Create error pages: `inertia/pages/errors/404.tsx`, `inertia/pages/errors/403.tsx`, `inertia/pages/errors/500.tsx`
- [ ] T131 [P] Implement rate limiting for sensitive endpoints: /auth/register (3/hour), /auth/login (5/15min), /links (100/hour), /qr/generate (50/hour)
- [ ] T132 [P] Add URL validation service to prevent malicious links (phishing detection) in `app/services/url_validator_service.ts`
- [ ] T133 [P] Implement data retention job for click_events (12 months for free users) in `start/scheduler.ts`
- [ ] T134 [P] Add GDPR compliance: data export API endpoint, deletion workflow
- [ ] T135 [P] Optimize database queries: add eager loading for relationships, query result caching for public pages
- [ ] T136 [P] Add security headers middleware (CSP, X-Frame-Options, HSTS)
- [ ] T137 [P] Create seed data in `database/seeders/demo_data_seeder.ts` for demo/testing accounts
- [ ] T138 [P] Add logging for critical operations (auth events, payment events, errors) using AdonisJS Logger
- [ ] T139 Run quickstart.md validation: verify all setup steps work, database connects, assets build, tests pass
- [ ] T140 Create comprehensive README.md with project overview, setup instructions, deployment guide

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - **MVP candidate**
  - User Story 2 (P1): Can start after Foundational - extends US1 but independently testable
  - User Story 3 (P2): Can start after Foundational - uses links from US1/US2
  - User Story 4 (P2): Can start after Foundational - independent e-commerce flow
  - User Story 5 (P3): Can start after Foundational - enhances landing pages from US1
- **Polish (Phase 8)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - **START HERE FOR MVP**
- **User Story 2 (P1)**: No blocking dependencies on US1 (can work in parallel), but naturally extends it
- **User Story 3 (P2)**: Uses links from US1/US2 but independently testable
- **User Story 4 (P2)**: Completely independent e-commerce flow
- **User Story 5 (P3)**: Enhances US1 landing pages but optional

### Within Each User Story

- Authentication setup before page creation (US1)
- Database migrations before models
- Models before services
- Services before controllers
- Controllers before frontend pages
- Core implementation before integration

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Within each story: tasks marked [P] can run in parallel (different files, no dependencies)

---

## Parallel Example: User Story 1

```bash
# After completing auth routes, these can run in parallel:
Task T047: Create dashboard index page
Task T048: Create pages index page
Task T049: Create page creation form

# After completing models, these components can be built in parallel:
Task T051: Create LinkList component
Task T052: Create ThemeCustomizer component
Task T053: Create LivePreview component
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T012)
2. Complete Phase 2: Foundational (T013-T027) - **CRITICAL MILESTONE**
3. Complete Phase 3: User Story 1 (T028-T058) - **MVP COMPLETE**
4. **STOP and VALIDATE**: Test independently - users can create landing pages
5. Deploy to Railway staging
6. Demo and collect feedback

**MVP Scope**: Phases 1-3 = ~58 tasks = Full authentication + landing page creation with link management

### Incremental Delivery (Recommended)

1. MVP (Phases 1-3) → Deploy → Validate
2. Add User Story 2 (Phase 4: T059-T078) → Deploy → Validate analytics
3. Add User Story 3 (Phase 5: T079-T090) → Deploy → Validate QR codes
4. Add User Story 4 (Phase 6: T091-T112) → Deploy → Validate e-commerce
5. (Optional) Add User Story 5 (Phase 7: T113-T128) → Deploy
6. Polish (Phase 8: T129-T140) → Production-ready

### Parallel Team Strategy

With 3 developers after Foundational phase completes:

- Developer A: User Story 1 (P1) - Authentication + Landing Pages
- Developer B: User Story 2 (P1) - Link Shortening + Analytics
- Developer C: User Story 3 (P2) - QR Code Generation

Stories integrate independently, no blocking dependencies.

---

## Task Summary

**Total Tasks**: 140
- Phase 1 (Setup): 12 tasks
- Phase 2 (Foundational): 15 tasks (BLOCKS all stories)
- Phase 3 (US1 - Landing Pages): 31 tasks ← **MVP**
- Phase 4 (US2 - Analytics): 20 tasks
- Phase 5 (US3 - QR Codes): 12 tasks
- Phase 6 (US4 - E-commerce): 22 tasks
- Phase 7 (US5 - Advanced Config): 16 tasks
- Phase 8 (Polish): 12 tasks

**Parallel Tasks**: 82 marked with [P] (59% parallelizable)

**MVP Scope**: Phases 1-3 = 58 tasks (41% of total)

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `node ace migration:run` after adding new migrations
- Use `npm run dev` for hot reload during development
- Deploy to Railway after each completed user story for validation
