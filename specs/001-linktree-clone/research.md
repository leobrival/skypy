# Research Document: Linktree Clone Technical Decisions

**Feature**: 001-linktree-clone
**Date**: 2025-11-20
**Phase**: 0 (Research & Decision Making)

## Overview

This document captures all technical research and architectural decisions made during the planning phase. Each decision includes rationale, alternatives considered, and trade-offs.

## 1. Framework Choice: AdonisJS 6 + Inertia.js

**Decision**: Use AdonisJS 6 with Inertia.js adapter for a monolithic full-stack application

**Rationale**:
- **Developer Productivity**: Single codebase deployment eliminates API versioning complexity
- **Type Safety**: TypeScript across entire stack with shared types between server and client
- **Inertia Advantage**: SPA-like UX without REST API overhead (no endpoint duplication)
- **AdonisJS Batteries**: Built-in ORM (Lucid), auth, validation, migrations reduce third-party dependencies
- **Railway Optimization**: Single dyno deployment reduces hosting costs and complexity

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| Next.js 14 App Router | Modern React patterns, excellent DX, Vercel optimization | Server components complexity, vendor lock-in concerns | Inertia provides simpler mental model for full-stack app |
| Laravel + Inertia | Mature Inertia integration, large community | PHP ecosystem less aligned with modern TypeScript tooling | TypeScript-first approach preferred for type safety |
| Separate React SPA + REST API | Clear separation, scalable independently | API versioning complexity, CORS issues, double validation | Unnecessary complexity for monolithic use case |

**Implementation Notes**:
- Use `@adonisjs/inertia` official adapter
- Vite for asset bundling with HMR
- Server-side props for data fetching (no client-side data layer needed)

## 2. UI Framework: ShadcnUI + Tailwind CSS

**Decision**: Use ShadcnUI component library with Tailwind CSS for styling

**Rationale**:
- **Copy-Paste Philosophy**: Components copied into codebase (full control, no black box)
- **Radix UI Foundation**: Accessible primitives (keyboard navigation, ARIA labels)
- **Glide-Inspired Minimalism**: Clean, modern aesthetic matches spec requirements
- **Customization**: Easy theming with CSS variables and Tailwind config
- **TypeScript Native**: Fully typed components with React 18 support

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| Material UI | Comprehensive component set, battle-tested | Heavy bundle size, opinionated design | Too heavyweight for minimalist UI |
| Chakra UI | Good DX, theme system | Smaller community than MUI | ShadcnUI provides more control |
| Headless UI + Custom CSS | Full control, minimal deps | More implementation work | ShadcnUI strikes better balance |
| Ant Design | Enterprise-grade, extensive components | Chinese design language, large bundle | Not aligned with Glide aesthetic |

**Implementation Notes**:
- Install ShadcnUI via CLI: `npx shadcn-ui@latest init`
- Add components as needed: `npx shadcn-ui@latest add button card dialog`
- Use Recharts for analytics charts (ShadcnUI compatible)
- Implement dark mode with CSS variables

## 3. Link Shortening Strategy

**Decision**: Database-backed short codes with nanoid generation

**Rationale**:
- **Collision Resistance**: nanoid with 10-character alphabet provides 2.9M years to 1% collision probability at 1000 IDs/hour
- **Database Efficiency**: Single table lookup for redirects (<5ms with indexed `short_code` column)
- **Customization Support**: Users can optionally customize slugs (validate uniqueness)
- **Analytics Integration**: Direct foreign key relationship enables efficient click tracking

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| Hash-based (MD5/SHA) | Deterministic, no DB write needed | Long codes, no custom slugs, collision handling complex | User experience degraded |
| Sequential IDs (base62) | Predictable, minimal storage | Enumeration vulnerability, no randomness | Security concern |
| Redis + DB hybrid | Ultra-fast redirects | Added complexity, Redis hosting cost | Over-engineering for initial scale |

**Implementation Details**:
```typescript
// Generate short code
import { nanoid } from 'nanoid'
const shortCode = nanoid(8) // 8 chars = 2.1M IDs with <1% collision risk

// Custom slug validation
const isAvailable = await Link.query()
  .where('short_code', customSlug)
  .orWhere('short_code', 'ilike', customSlug) // Case-insensitive check
  .first()
```

**Performance Optimization**:
- B-tree index on `short_code` column
- Caching layer (in-memory LRU) for top 10% most-clicked links
- CDN for static redirects (future enhancement)

## 4. QR Code Generation: qrcode Package

**Decision**: Use `qrcode` npm package with server-side generation

**Rationale**:
- **Node-Native**: Pure JavaScript, no external dependencies (canvas/sharp for images)
- **Format Support**: PNG, SVG output (spec requirement)
- **Customization**: Color, error correction, margin control
- **Performance**: <100ms generation time for standard QR codes

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| qr-code-styling | Advanced customization (gradients, logo embedding) | Larger bundle, browser-only | Need server-side generation |
| Client-side generation (react-qr-code) | No server load, instant preview | Logo embedding requires canvas manipulation | Complex implementation |
| External API (QR Code API) | Zero implementation | External dependency, rate limits, privacy concerns | Data sovereignty issue |

**Implementation Details**:
```typescript
import QRCode from 'qrcode'
import sharp from 'sharp' // For logo embedding

// Generate QR code with customization
const qrBuffer = await QRCode.toBuffer(url, {
  errorCorrectionLevel: 'H', // High = 30% damage tolerance
  color: {
    dark: foregroundColor,
    light: backgroundColor
  },
  width: 1024
})

// Embed logo (if provided)
if (logoPath) {
  const qrImage = sharp(qrBuffer)
  const logo = sharp(logoPath).resize(200, 200) // 20% of QR size
  await qrImage.composite([{ input: await logo.toBuffer(), gravity: 'center' }])
}
```

**File Storage**:
- Development: Local `public/qr-codes/` directory
- Production: Railway Volumes (persistent storage) or S3-compatible (Cloudflare R2)

## 5. Analytics Strategy: Event-Driven with Aggregation

**Decision**: Store raw click events + periodic aggregation for dashboard queries

**Rationale**:
- **Data Integrity**: Raw events preserved for auditing and re-processing
- **Query Performance**: Pre-aggregated tables for dashboard (<50ms response time)
- **Flexibility**: Can add new metrics without losing historical data
- **Privacy Compliance**: IP hashing at write time for GDPR compliance

**Architecture**:
```
ClickEvent (raw events) → DailyAggregation (rollup) → Dashboard queries
```

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| Direct event queries | Simple implementation | Slow dashboard loading (full table scans) | Performance requirement not met |
| Third-party analytics (PostHog, Plausible) | Battle-tested, feature-rich | Vendor lock-in, monthly cost, data export limits | Cost and control concerns |
| Time-series DB (TimescaleDB) | Optimized for time-series | Additional DB to manage, learning curve | Over-engineering |

**Implementation Details**:
```typescript
// Click event capture (middleware)
async handle({ request, response }: HttpContext, next: NextFn) {
  const start = performance.now()
  await next()
  const duration = performance.now() - start

  await ClickEvent.create({
    linkId: extractedLinkId,
    timestamp: new Date(),
    ipHash: hashIP(request.ip()),
    userAgent: request.header('user-agent'),
    referer: request.header('referer'),
    country: await geolocate(request.ip()),
    device: parseUserAgent(request.header('user-agent'))
  })
}

// Aggregation job (runs daily at 2 AM)
async aggregateYesterdayClicks() {
  const yesterday = DateTime.now().minus({ days: 1 }).startOf('day')

  await Database.rawQuery(`
    INSERT INTO daily_aggregations (link_id, date, total_clicks, unique_visitors, top_country, top_device)
    SELECT
      link_id,
      DATE(timestamp),
      COUNT(*) as total_clicks,
      COUNT(DISTINCT ip_hash) as unique_visitors,
      MODE() WITHIN GROUP (ORDER BY country) as top_country,
      MODE() WITHIN GROUP (ORDER BY device) as top_device
    FROM click_events
    WHERE DATE(timestamp) = ?
    GROUP BY link_id, DATE(timestamp)
  `, [yesterday.toSQLDate()])
}
```

**Privacy Considerations**:
- SHA-256 hashing of IP addresses with daily salt rotation
- No storage of raw IPs or exact coordinates
- 12-month retention for free users (auto-purge via cron job)
- GDPR-compliant data export API

## 6. Payment Processing: Stripe Checkout

**Decision**: Use Stripe Checkout (hosted) for virtual card purchases

**Rationale**:
- **Security**: PCI compliance handled by Stripe (no credit card data touches our servers)
- **UX**: Pre-built checkout UI (mobile-optimized, localized)
- **Features**: Supports multiple payment methods (cards, Apple Pay, Google Pay)
- **Webhooks**: Reliable order fulfillment via webhook events

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| Stripe Payment Element (embedded) | Custom branded experience | PCI compliance burden, more code to maintain | Security risk for MVP |
| PayPal | Widely recognized, no Stripe fees | Lower conversion rates, clunky UX | Stripe provides better DX |
| Paddle | Merchant of record (handles VAT/tax) | Higher fees (5% + payment), less control | Cost prohibitive |

**Implementation Details**:
```typescript
// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: { name: product.name },
      unit_amount: product.priceInCents
    },
    quantity: 1
  }],
  success_url: `${baseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/shop`,
  metadata: { product_id: product.id, customer_email: user.email }
})

// Webhook handler for fulfillment
async handleWebhook({ request }: HttpContext) {
  const sig = request.header('stripe-signature')
  const event = stripe.webhooks.constructEvent(request.raw(), sig, webhookSecret)

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    await Order.create({
      productId: session.metadata.product_id,
      customerEmail: session.metadata.customer_email,
      amount: session.amount_total,
      stripeSessionId: session.id,
      fulfillmentStatus: 'pending'
    })

    await this.sendActivationEmail(order)
  }
}
```

**Refund Policy**:
- 14-day refund window (spec requirement FR-031)
- Admin dashboard action: `stripe.refunds.create({ charge: order.stripeChargeId })`

## 7. Authentication: Session + OAuth

**Decision**: Session-based auth with optional OAuth (Google, GitHub)

**Rationale**:
- **Simplicity**: AdonisJS session middleware handles cookie management
- **Security**: HTTPOnly cookies prevent XSS attacks
- **UX**: "Remember me" functionality built-in
- **OAuth Integration**: `@adonisjs/ally` for social login

**Alternatives Considered**:

| Alternative | Pros | Cons | Why Rejected |
| --- | --- | --- | --- |
| JWT tokens | Stateless, mobile-friendly | Requires manual expiration handling, harder to revoke | Unnecessary for web-first app |
| Magic links (email-only) | Passwordless UX | Email deliverability issues, not universally loved | User preference for passwords |

**Implementation Details**:
```typescript
// config/auth.ts
export default {
  guard: 'web',
  guards: {
    web: {
      driver: 'session',
      provider: { driver: 'lucid', model: User }
    }
  }
}

// OAuth configuration
export default {
  google: {
    driver: 'google',
    clientId: env.get('GOOGLE_CLIENT_ID'),
    clientSecret: env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: '/auth/google/callback'
  }
}
```

**Session Security**:
- CSRF protection enabled (AdonisJS default)
- Secure cookies in production (HTTPS-only)
- 30-day session expiration (spec requirement FR-004)

## 8. Database Schema: PostgreSQL with Lucid ORM (Neon)

**Decision**: PostgreSQL 15+ hosted on Neon with Lucid ORM for data persistence

**Rationale**:
- **Relational Integrity**: Foreign keys ensure referential integrity (user → pages → links)
- **JSONB Support**: Store theme configurations as flexible JSON (no schema migrations for new colors)
- **Full-Text Search**: Future enhancement for link search
- **Neon Advantages**: Serverless PostgreSQL with instant branching, autoscaling, 0.5GB free tier, built-in connection pooling
- **Railway Compatible**: Neon works seamlessly with Railway via DATABASE_URL environment variable

**Key Tables**:
- `users` (id, email, username, password_hash, tier, email_verified_at)
- `landing_pages` (id, user_id, slug, profile_name, bio, theme_config:jsonb)
- `links` (id, user_id, landing_page_id, title, destination_url, short_code, click_count)
- `click_events` (id, link_id, timestamp, ip_hash, country, device, referer)
- `qr_codes` (id, link_id, customization:jsonb, file_path)
- `products` (id, seller_id, name, description, price_cents, card_template:jsonb)
- `orders` (id, product_id, customer_email, stripe_session_id, fulfillment_status, activation_token)

**Indexing Strategy**:
```sql
CREATE INDEX idx_links_short_code ON links(short_code); -- Redirect lookups
CREATE INDEX idx_click_events_link_timestamp ON click_events(link_id, timestamp DESC); -- Analytics queries
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug); -- Public page lookups
CREATE INDEX idx_orders_activation_token ON orders(activation_token) WHERE fulfillment_status = 'pending'; -- Partial index
```

**Neon-Specific Optimizations**:
- **Connection Pooling**: Neon provides built-in pooling (max 100 connections on free tier)
- **Branch Databases**: Use Neon branching for preview environments (automatic branch per PR)
- **Autoscaling**: Neon scales compute automatically based on load
- **Cold Start**: <1s cold start time for serverless PostgreSQL

## 9. Deployment: Railway + Neon

**Decision**: Deploy to Railway with Neon PostgreSQL

**Rationale**:
- **Railway for App**: Zero-config AdonisJS detection, automatic SSL, $5/month
- **Neon for Database**: Serverless PostgreSQL, 0.5GB free tier, instant branching
- **Separation of Concerns**: Database and app can scale independently
- **Cost Optimization**: Neon free tier (0.5GB) + Railway starter ($5) = Better than Railway PostgreSQL
- **Environment Variables**: Railway automatically injects Neon DATABASE_URL

**Deployment Workflow**:
1. Push to `main` branch
2. Railway detects changes
3. Installs dependencies (`npm ci`)
4. Runs migrations (`node ace migration:run --force`)
5. Builds assets (`npm run build`)
6. Starts server (`node server.js`)

**railway.toml**:
```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node server.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

**Environment Variables** (set in Railway dashboard):
```
NODE_ENV=production
APP_KEY=<generated-secret>
DATABASE_URL=<neon-postgres-url>  # From Neon dashboard
STRIPE_SECRET_KEY=<stripe-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>
GOOGLE_CLIENT_ID=<oauth-client>
GOOGLE_CLIENT_SECRET=<oauth-secret>
```

**Neon Setup**:
1. Create Neon project at https://neon.tech
2. Copy connection string (pooled connection recommended)
3. Add DATABASE_URL to Railway environment variables
4. Neon automatically handles connection pooling and scaling

## 10. Testing Strategy

**Decision**: Three-tier testing approach (unit, functional, e2e)

**Test Distribution**:
- **Unit Tests** (60%): Services, models, helpers
- **Functional Tests** (30%): Controllers, database integration
- **E2E Tests** (10%): Critical user flows (signup → create page → publish)

**Tools**:
- **Japa**: AdonisJS native test runner
- **Vitest + React Testing Library**: Frontend component tests
- **Playwright**: E2E browser automation

**Coverage Targets**:
- Services: >90% (business logic critical)
- Controllers: >80% (HTTP layer)
- Components: >70% (UI focus)

**Example Test Structure**:
```typescript
// tests/functional/links/shorten_link.spec.ts
test.group('Link shortening', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('generates unique short code for valid URL', async ({ client, assert }) => {
    const user = await User.create({ /* ... */ })
    const response = await client
      .post('/links')
      .loginAs(user)
      .json({ url: 'https://example.com/very-long-url' })

    response.assertStatus(201)
    assert.match(response.body().short_code, /^[a-zA-Z0-9]{8}$/)
  })
})
```

## Summary of Key Decisions

| Decision Area | Choice | Primary Reason |
| --- | --- | --- |
| Framework | AdonisJS 6 + Inertia.js | Monolithic productivity |
| UI Library | ShadcnUI + Tailwind | Minimalist aesthetic + full control |
| Link Shortening | nanoid + PostgreSQL | Collision resistance + flexibility |
| QR Generation | qrcode package | Server-side control + customization |
| Analytics | Event store + aggregation | Performance + flexibility |
| Payments | Stripe Checkout | Security + compliance |
| Auth | Session + OAuth | Simplicity + social login |
| Database | Neon PostgreSQL + Lucid | Serverless + branching + cost |
| Hosting | Railway + Neon | Zero-config app + scalable DB |
| Testing | Japa + Vitest + Playwright | Full-stack coverage |

## Open Questions (None)

All technical clarifications have been resolved. Ready to proceed to Phase 1 (Data Model & Contracts).
