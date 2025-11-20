# Data Model: Linktree Clone

**Feature**: 001-linktree-clone
**Date**: 2025-11-20
**Database**: PostgreSQL 15+ (Neon Serverless)
**ORM**: Lucid (AdonisJS)

## Overview

This document defines the complete data model including entities, relationships, constraints, and indexes. All tables use `snake_case` naming (PostgreSQL convention) while Lucid models use `camelCase`.

## Entity Relationship Diagram

```
User (1) ─────< (M) LandingPage
  │                     │
  │                     └──< (M) Link
  │
  ├──< (M) Link (standalone shortened links)
  │         │
  │         ├──< (M) ClickEvent
  │         └──< (M) QRCode
  │
  └──< (M) Product
            │
            └──< (M) Order
```

## Entities

### 1. User

Represents platform users (both landing page creators and virtual card sellers).

**Table**: `users`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Public username (URL-safe) |
| password_hash | VARCHAR(255) | NULL | Bcrypt hash (NULL for OAuth-only users) |
| profile_image_url | TEXT | NULL | Path to uploaded profile image |
| account_tier | ENUM('free', 'premium') | NOT NULL, DEFAULT 'free' | Subscription level |
| email_verified_at | TIMESTAMP | NULL | Email verification timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(LOWER(email));
CREATE UNIQUE INDEX idx_users_username ON users(LOWER(username));
CREATE INDEX idx_users_email_verified ON users(email_verified_at) WHERE email_verified_at IS NOT NULL;
```

**Validation Rules** (from FR-001, FR-002):
- Email: Valid RFC 5322 format, max 255 chars
- Username: Alphanumeric + hyphens/underscores, 3-50 chars, unique (case-insensitive)
- Password: Min 8 chars, at least one uppercase, one number (enforced at application layer)

**Relationships**:
- `hasMany(LandingPage)`
- `hasMany(Link)` (standalone shortened links)
- `hasMany(Product)` (as seller)

---

### 2. LandingPage

User's public link-in-bio page (Linktree-style).

**Table**: `landing_pages`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Page owner |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL slug (e.g., /johndoe) |
| profile_name | VARCHAR(100) | NOT NULL | Display name on page |
| bio | TEXT | NULL | Short bio (max 500 chars) |
| theme_config | JSONB | NOT NULL, DEFAULT '{}' | Theme customization |
| visibility | ENUM('public', 'unlisted', 'private') | NOT NULL, DEFAULT 'public' | Access control |
| view_count | INTEGER | NOT NULL, DEFAULT 0 | Total page views |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Page creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**theme_config JSONB Structure**:
```json
{
  "backgroundColor": "#ffffff",
  "textColor": "#000000",
  "buttonStyle": "rounded",
  "buttonColor": "#000000",
  "buttonTextColor": "#ffffff",
  "fontFamily": "Inter"
}
```

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_landing_pages_slug ON landing_pages(LOWER(slug));
CREATE INDEX idx_landing_pages_user_id ON landing_pages(user_id);
CREATE INDEX idx_landing_pages_visibility ON landing_pages(visibility) WHERE visibility = 'public';
```

**Validation Rules** (from FR-005, FR-008):
- Slug: URL-safe (alphanumeric + hyphens), 3-100 chars, unique (case-insensitive)
- Profile name: Max 100 chars
- Bio: Max 500 chars
- Theme config: Valid JSON matching schema

**Relationships**:
- `belongsTo(User)`
- `hasMany(Link)`

---

### 3. Link

Individual clickable links (can belong to landing page or be standalone shortened link).

**Table**: `links`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Link owner |
| landing_page_id | UUID | FOREIGN KEY → landing_pages(id) ON DELETE CASCADE, NULL | Parent page (NULL for standalone) |
| title | VARCHAR(200) | NULL | Display title (NULL for standalone links) |
| description | TEXT | NULL | Optional description |
| destination_url | TEXT | NOT NULL | Target URL |
| short_code | VARCHAR(20) | UNIQUE, NOT NULL | Short link identifier |
| expiration_date | TIMESTAMP | NULL | Optional expiration (FR-015) |
| click_count | INTEGER | NOT NULL, DEFAULT 0 | Cached click total |
| position | INTEGER | NULL | Order within landing page (NULL for standalone) |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Enable/disable link |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Link creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_links_short_code ON links(LOWER(short_code));
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_landing_page_id ON links(landing_page_id) WHERE landing_page_id IS NOT NULL;
CREATE INDEX idx_links_active_unexpired ON links(is_active, expiration_date) WHERE is_active = TRUE AND (expiration_date IS NULL OR expiration_date > NOW());
```

**Validation Rules** (from FR-011, FR-013, FR-014):
- Destination URL: Valid HTTP/HTTPS, max 2048 chars, passes malicious link check
- Short code: 8 chars (auto-generated) or custom (3-20 chars, URL-safe, unique)
- Title: Max 200 chars
- Description: Max 1000 chars

**Relationships**:
- `belongsTo(User)`
- `belongsTo(LandingPage)` (optional)
- `hasMany(ClickEvent)`
- `hasMany(QRCode)`

---

### 4. ClickEvent

Analytics event captured on link click (raw event log).

**Table**: `click_events`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| link_id | UUID | FOREIGN KEY → links(id) ON DELETE CASCADE, NOT NULL | Clicked link |
| timestamp | TIMESTAMP | NOT NULL, DEFAULT NOW() | Click time |
| ip_hash | CHAR(64) | NOT NULL | SHA-256 hash of IP |
| user_agent | TEXT | NULL | Full user agent string |
| referer | TEXT | NULL | Referring URL |
| country | VARCHAR(2) | NULL | ISO 3166-1 alpha-2 country code |
| city | VARCHAR(100) | NULL | City name |
| device_type | ENUM('mobile', 'tablet', 'desktop', 'bot') | NOT NULL | Device category |
| browser | VARCHAR(50) | NULL | Browser name |
| os | VARCHAR(50) | NULL | Operating system |

**Indexes**:
```sql
CREATE INDEX idx_click_events_link_id_timestamp ON click_events(link_id, timestamp DESC);
CREATE INDEX idx_click_events_timestamp ON click_events(timestamp DESC);
CREATE INDEX idx_click_events_ip_hash_timestamp ON click_events(ip_hash, timestamp) WHERE timestamp > NOW() - INTERVAL '24 hours'; -- Unique visitor detection
```

**Partitioning Strategy** (future optimization):
```sql
-- Partition by month for time-series optimization
CREATE TABLE click_events_2025_11 PARTITION OF click_events
  FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

**Data Retention** (from FR-020):
- Free users: Auto-delete events older than 12 months
- Premium users: Unlimited retention
- Implement via scheduled job: `node ace analytics:purge`

**Validation Rules** (from FR-017):
- IP hash: 64-char hex string (SHA-256 output)
- Country: Valid ISO 3166-1 alpha-2 code
- Device type: One of enum values
- User agent: Max 500 chars

**Relationships**:
- `belongsTo(Link)`

---

### 5. QRCode

Generated QR code with customization settings.

**Table**: `qr_codes`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| link_id | UUID | FOREIGN KEY → links(id) ON DELETE CASCADE, NOT NULL | Associated link |
| customization | JSONB | NOT NULL | QR styling options |
| file_path | TEXT | NOT NULL | Path to generated file |
| format | ENUM('png_1024', 'png_2048', 'svg') | NOT NULL | Export format |
| download_count | INTEGER | NOT NULL, DEFAULT 0 | Times downloaded |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Generation time |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**customization JSONB Structure**:
```json
{
  "foregroundColor": "#000000",
  "backgroundColor": "#ffffff",
  "errorCorrectionLevel": "H",
  "logoPath": "/uploads/qr-logos/user123-logo.png",
  "margin": 4,
  "cornerStyle": "rounded"
}
```

**Indexes**:
```sql
CREATE INDEX idx_qr_codes_link_id ON qr_codes(link_id);
```

**Validation Rules** (from FR-022, FR-023, FR-024):
- Foreground/background colors: Valid hex color codes
- Error correction level: L, M, Q, or H
- Logo file: Max 2MB, PNG/JPEG only
- Format: One of enum values

**Relationships**:
- `belongsTo(Link)`

---

### 6. Product

Virtual card offering for sale in marketplace.

**Table**: `products`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| seller_id | UUID | FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL | Product creator |
| name | VARCHAR(200) | NOT NULL | Product name |
| description | TEXT | NOT NULL | Product description |
| price_cents | INTEGER | NOT NULL | Price in cents (e.g., 2900 = €29.00) |
| card_template | JSONB | NOT NULL | Pre-configured card design |
| preview_image_url | TEXT | NULL | Product preview image |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Available for purchase |
| sales_count | INTEGER | NOT NULL, DEFAULT 0 | Total sales |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Product creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**card_template JSONB Structure**:
```json
{
  "themePreset": "minimal_black",
  "includedFeatures": ["custom_domain", "analytics_pro", "priority_support"],
  "defaultLayout": "centered",
  "customCSS": ""
}
```

**Indexes**:
```sql
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
```

**Validation Rules** (from FR-026):
- Name: Max 200 chars
- Description: Max 5000 chars
- Price: Min 100 cents (€1.00), max 100000 cents (€1000.00)
- Preview image: Max 5MB, PNG/JPEG only

**Relationships**:
- `belongsTo(User)` (as seller)
- `hasMany(Order)`

---

### 7. Order

Purchase transaction for virtual card.

**Table**: `orders`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| product_id | UUID | FOREIGN KEY → products(id) ON DELETE RESTRICT, NOT NULL | Purchased product |
| customer_email | VARCHAR(255) | NOT NULL | Buyer email |
| amount_cents | INTEGER | NOT NULL | Paid amount in cents |
| stripe_session_id | VARCHAR(255) | UNIQUE, NOT NULL | Stripe Checkout session |
| stripe_charge_id | VARCHAR(255) | NULL | Stripe charge ID (for refunds) |
| payment_status | ENUM('pending', 'paid', 'refunded') | NOT NULL, DEFAULT 'pending' | Payment state |
| fulfillment_status | ENUM('pending', 'activated', 'expired') | NOT NULL, DEFAULT 'pending' | Fulfillment state |
| activation_token | VARCHAR(64) | UNIQUE, NULL | One-time activation token |
| activated_at | TIMESTAMP | NULL | Activation timestamp |
| expires_at | TIMESTAMP | NOT NULL | Activation link expiry (30 days from creation) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Order creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update |

**Indexes**:
```sql
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_activation_token ON orders(activation_token) WHERE fulfillment_status = 'pending';
CREATE INDEX idx_orders_pending_expired ON orders(fulfillment_status, expires_at) WHERE fulfillment_status = 'pending' AND expires_at < NOW();
```

**Validation Rules** (from FR-028, FR-029, FR-030):
- Customer email: Valid RFC 5322 format
- Activation token: 64-char random string (generated with crypto.randomBytes)
- Expiration: 30 days from order creation
- Refund window: 14 days from purchase (enforced at application layer)

**Relationships**:
- `belongsTo(Product)`

---

## Aggregate Tables (Analytics Optimization)

### DailyAggregation

Pre-aggregated analytics data for dashboard performance.

**Table**: `daily_aggregations`

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| link_id | UUID | FOREIGN KEY → links(id) ON DELETE CASCADE, NOT NULL | Link being aggregated |
| date | DATE | NOT NULL | Aggregation date |
| total_clicks | INTEGER | NOT NULL | Total clicks for day |
| unique_visitors | INTEGER | NOT NULL | Unique IP hashes |
| top_country | VARCHAR(2) | NULL | Most common country |
| top_device | ENUM('mobile', 'tablet', 'desktop', 'bot') | NULL | Most common device |
| top_referer | TEXT | NULL | Most common referer |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Aggregation time |

**Indexes**:
```sql
CREATE UNIQUE INDEX idx_daily_agg_link_date ON daily_aggregations(link_id, date);
CREATE INDEX idx_daily_agg_date ON daily_aggregations(date DESC);
```

**Generation**: Cron job runs daily at 2 AM UTC, processes previous day's `click_events`.

---

## Database Constraints

### Foreign Key Cascade Rules

- User deletion → Cascade to all landing pages, links, products
- Landing page deletion → Cascade to links (if landing_page_id NOT NULL)
- Link deletion → Cascade to click events and QR codes
- Product deletion → Restrict if orders exist (prevent data loss)

### Check Constraints

```sql
ALTER TABLE users ADD CONSTRAINT chk_username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');
ALTER TABLE links ADD CONSTRAINT chk_short_code_format CHECK (short_code ~ '^[a-zA-Z0-9-]+$');
ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price_cents > 0);
ALTER TABLE orders ADD CONSTRAINT chk_expires_after_created CHECK (expires_at > created_at);
```

---

## Migrations

### Migration Order

1. `001_create_users_table.ts`
2. `002_create_landing_pages_table.ts`
3. `003_create_links_table.ts`
4. `004_create_click_events_table.ts`
5. `005_create_qr_codes_table.ts`
6. `006_create_products_table.ts`
7. `007_create_orders_table.ts`
8. `008_create_daily_aggregations_table.ts`
9. `009_add_indexes.ts`

### Example Migration (003_create_links_table.ts)

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.uuid('landing_page_id').nullable().references('id').inTable('landing_pages').onDelete('CASCADE')
      table.string('title', 200).nullable()
      table.text('description').nullable()
      table.text('destination_url').notNullable()
      table.string('short_code', 20).notNullable().unique()
      table.timestamp('expiration_date').nullable()
      table.integer('click_count').notNullable().defaultTo(0)
      table.integer('position').nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

      // Indexes
      table.index('user_id')
      table.index(['landing_page_id'], 'idx_links_landing_page_id')
      table.index(['is_active', 'expiration_date'], 'idx_links_active_unexpired')
    })

    this.schema.raw('CREATE UNIQUE INDEX idx_links_short_code ON links(LOWER(short_code))')
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

---

## Data Integrity Rules

1. **Email Uniqueness**: Case-insensitive (use `LOWER()` in unique indexes)
2. **Slug Uniqueness**: Case-insensitive, URL-safe characters only
3. **Short Code Uniqueness**: Case-insensitive, collision-resistant
4. **Activation Token**: Single-use (mark order as activated after use)
5. **Referential Integrity**: All foreign keys enforced at database level
6. **Soft Deletes**: Not used (hard deletes with cascade for GDPR compliance)

---

## Performance Considerations

1. **Query Optimization**: All foreign keys indexed
2. **Read-Heavy Tables**: `click_events` and `daily_aggregations` benefit from partitioning
3. **Caching Strategy**: Most-clicked links cached in-memory (LRU cache)
4. **Connection Pooling**: Neon provides built-in pooling (100 connections on free tier, use pooled connection string)
5. **JSONB Indexing**: Consider GIN indexes on `theme_config` if filtering by theme properties
6. **Neon Autoscaling**: Database automatically scales compute based on load
7. **Neon Branching**: Use separate branches for dev/staging/production to isolate data
