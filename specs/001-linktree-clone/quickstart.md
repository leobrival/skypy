# Quickstart Guide: Linktree Clone Development

**Feature**: 001-linktree-clone
**Last Updated**: 2025-11-20
**Prerequisites**: Node.js 20 LTS, Neon account (free tier), Git

## Table of Contents

1. [Project Setup](#project-setup)
2. [Development Environment](#development-environment)
3. [Database Configuration](#database-configuration)
4. [Running the Application](#running-the-application)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Deployment to Railway](#deployment-to-railway)

---

## Project Setup

### 1. Initialize AdonisJS Project

```bash
# Create new AdonisJS 6 project with Inertia + React preset
npm init adonisjs@latest skypy -- -K=inertia --auth-guard=session --db=postgres

cd skypy
```

### 2. Install Additional Dependencies

```bash
# UI dependencies
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react recharts
npm install @dnd-kit/core @dnd-kit/sortable  # Drag-and-drop for link reordering

# Backend dependencies
npm install nanoid                             # Short link generation
npm install qrcode sharp                       # QR code generation
npm install stripe                             # Payment processing
npm install @adonisjs/mail                     # Email service
npm install @adonisjs/ally                     # OAuth (Google, GitHub)
npm install ua-parser-js maxmind               # Analytics (user agent, geolocation)

# Development dependencies
npm install -D @biomejs/biome                  # Linting & formatting
npm install -D @playwright/test                # E2E testing
```

### 3. Initialize ShadcnUI

```bash
# Initialize shadcn-ui with Tailwind
npx shadcn-ui@latest init

# Select the following options:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add required components
npx shadcn-ui@latest add button input card dialog select label
npx shadcn-ui@latest add dropdown-menu avatar badge tabs
npx shadcn-ui@latest add form table chart
```

### 4. Project Structure Setup

```bash
# Create directory structure
mkdir -p app/services
mkdir -p app/exceptions
mkdir -p inertia/components/landing-page
mkdir -p inertia/components/analytics
mkdir -p inertia/components/qr
mkdir -p public/uploads/profiles
mkdir -p public/uploads/qr-logos
mkdir -p public/qr-codes
```

---

## Development Environment

### Environment Variables

Create `.env` file:

```env
# Application
NODE_ENV=development
PORT=3333
HOST=localhost
LOG_LEVEL=debug
APP_KEY=<generated-by-adonisjs>
APP_URL=http://localhost:3333

# Database (Neon PostgreSQL - use pooled connection)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/skypy_dev?sslmode=require

# Session
SESSION_DRIVER=cookie

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Email (Mailtrap for development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USERNAME=...
SMTP_PASSWORD=...
MAIL_FROM_ADDRESS=noreply@skypy.dev
MAIL_FROM_NAME=Skypy

# GeoIP (MaxMind account)
MAXMIND_LICENSE_KEY=...
```

### Configuration Files

**config/database.ts** (Neon connection via DATABASE_URL):

```typescript
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

export default defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: env.get('DATABASE_URL'), // Neon connection string
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      pool: {
        min: 2,
        max: 10, // Neon free tier allows 100 pooled connections
      },
    },
  },
})
```

**config/stripe.ts** (create new file):

```typescript
import env from '#start/env'

export default {
  secretKey: env.get('STRIPE_SECRET_KEY'),
  webhookSecret: env.get('STRIPE_WEBHOOK_SECRET'),
  publishableKey: env.get('STRIPE_PUBLISHABLE_KEY'),
}
```

**tailwind.config.js** (extend for ShadcnUI):

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './inertia/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other ShadcnUI colors
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## Database Configuration (Neon)

### 1. Create Neon Project

1. **Sign up at** https://neon.tech (free tier: 0.5GB storage)
2. **Create a new project** named "skypy"
3. **Create a database** named "skypy_dev"
4. **Copy the connection string** (use "Pooled connection" for better performance)
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/skypy_dev?sslmode=require`
5. **Add to `.env`**: `DATABASE_URL=<your-neon-connection-string>`

**Neon Advantages**:
- Instant database branching for dev/staging/production
- Automatic connection pooling (100 connections on free tier)
- Serverless autoscaling based on load
- 0.5GB free storage (sufficient for MVP)

### 2. Run Migrations

```bash
# Generate UUID extension migration
node ace make:migration add_uuid_extension

# Edit migration to add:
# this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

# Run all migrations
node ace migration:run

# Check migration status
node ace migration:status
```

### 3. Seed Demo Data (optional)

```bash
# Create seeder
node ace make:seeder demo_data

# Run seeder
node ace db:seed
```

---

## Running the Application

### Development Mode

```bash
# Terminal 1: Start AdonisJS server with hot reload
npm run dev

# Terminal 2: Start Vite asset bundler (if separate)
# (Usually runs automatically with AdonisJS dev server)
```

Application accessible at: `http://localhost:3333`

### Useful Commands

```bash
# Generate app key (first time setup)
node ace generate:key

# List all routes
node ace list:routes

# Clear cache
node ace cache:clear

# Tinker (REPL)
node ace repl

# Database operations
node ace migration:fresh     # Drop all tables & re-migrate
node ace migration:rollback  # Rollback last batch
```

---

## Development Workflow

### 1. Create a New Feature

Follow this workflow for each user story from the spec:

```bash
# 1. Create migration
node ace make:migration create_links_table

# 2. Create model
node ace make:model Link

# 3. Create controller
node ace make:controller Link

# 4. Create validator
node ace make:validator link

# 5. Create Inertia page
# Manually create: inertia/pages/links/index.tsx

# 6. Add route
# Edit: start/routes.ts

# 7. Create tests
node ace make:test functional/links/create_link

# 8. Run tests
npm test
```

### 2. Typical File Locations

| Type | Location | Example |
| --- | --- | --- |
| Controller | `app/controllers/` | `links_controller.ts` |
| Model | `app/models/` | `link.ts` |
| Service | `app/services/` | `link_shortener_service.ts` |
| Validator | `app/validators/` | `link_validator.ts` |
| Migration | `database/migrations/` | `001_create_links_table.ts` |
| Inertia Page | `inertia/pages/` | `links/index.tsx` |
| Component | `inertia/components/` | `ui/button.tsx` |
| Test | `tests/functional/` | `links/create_link.spec.ts` |

### 3. Coding Conventions

**Backend (AdonisJS)**:
```typescript
// Controllers: Use Inertia responses
export default class LinksController {
  async index({ auth, inertia }: HttpContext) {
    const links = await Link.query().where('userId', auth.user!.id)
    return inertia.render('links/index', { links })
  }
}

// Services: Business logic separation
export default class LinkShortenerService {
  async generateShortCode(): Promise<string> {
    const code = nanoid(8)
    const exists = await Link.findBy('short_code', code)
    return exists ? this.generateShortCode() : code // Retry on collision
  }
}

// Validators: VineJS schema
import vine from '@vinejs/vine'

export const createLinkValidator = vine.compile(
  vine.object({
    destinationUrl: vine.string().url().maxLength(2048),
    title: vine.string().optional().maxLength(200),
  })
)
```

**Frontend (React + Inertia)**:
```typescript
// Pages: Receive props from controller
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'

export default function LinksIndex({ links }: { links: Link[] }) {
  return (
    <>
      <Head title="My Links" />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">My Links</h1>
        {links.map((link) => (
          <LinkCard key={link.id} link={link} />
        ))}
      </div>
    </>
  )
}

// Forms: Inertia form helpers
const { data, setData, post, processing, errors } = useForm({
  destinationUrl: '',
  title: '',
})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  post('/links')
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- tests/functional/links

# Run with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run E2E tests in UI mode
npx playwright test --ui
```

### Test Structure

**Functional Tests** (AdonisJS + Database):
```typescript
import { test } from '@japa/runner'
import Database from '@adonisjs/lucid/services/db'

test.group('Link shortening', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('creates shortened link', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const response = await client
      .post('/links')
      .loginAs(user)
      .json({ destinationUrl: 'https://example.com' })

    response.assertStatus(201)
    assert.exists(response.body().shortCode)
  })
})
```

**E2E Tests** (Playwright):
```typescript
import { test, expect } from '@playwright/test'

test('complete landing page creation flow', async ({ page }) => {
  await page.goto('http://localhost:3333/register')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'Password123!')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await page.click('text=Create Page')

  // ... continue testing user flow
})
```

---

## Deployment to Railway

### 1. Connect Repository

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project (if created via dashboard)
railway link
```

### 2. Railway Configuration

Create `railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "node server.js"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### 3. Connect Neon Database

**Option A: Via Railway Dashboard** (Recommended)
1. Go to Railway project settings
2. Add environment variable: `DATABASE_URL=<your-neon-pooled-connection-string>`
3. Railway will use Neon for database instead of built-in PostgreSQL

**Option B: Via Railway CLI**
```bash
railway variables set DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/skypy_prod?sslmode=require"
```

**Benefits of Neon + Railway**:
- Neon free tier (0.5GB) saves costs vs Railway PostgreSQL ($5/month)
- Database and app scale independently
- Use Neon branching for preview environments
- Neon handles connection pooling automatically

### 4. Configure Environment Variables

In Railway dashboard, add all required env vars from `.env.example`:

```
NODE_ENV=production
APP_KEY=<generate-new-key>
APP_URL=https://your-app.railway.app
DATABASE_URL=<neon-pooled-connection-string-prod>  # From Neon production branch
STRIPE_SECRET_KEY=sk_live_...
GOOGLE_CLIENT_ID=...
# ... etc
```

**Pro Tip**: Use Neon database branching
- **Production branch**: Main Neon database
- **Staging branch**: Neon branch with production schema, separate data
- **Dev branch**: Local development (separate Neon project or local PostgreSQL)

### 5. Deploy

```bash
# Deploy from local
railway up

# Or connect GitHub repo for automatic deployments
# (Recommended: push to main branch triggers deployment)
```

### 6. Run Migrations on Railway

```bash
# Connect to Railway environment
railway run node ace migration:run --force

# Or set up deployment command in Railway dashboard
# Build Command: npm run build
# Deploy Command: node ace migration:run --force && node server.js
```

### 7. Monitor Deployment

```bash
# View logs
railway logs

# Check status
railway status

# SSH into container (for debugging)
railway run bash
```

---

## Troubleshooting

### Common Issues

**Issue**: "Migration failed: relation already exists"
**Solution**: Drop database and re-run migrations:
```bash
node ace migration:fresh
```

**Issue**: "Inertia version mismatch"
**Solution**: Ensure frontend and backend Inertia versions match:
```bash
npm install @inertiajs/inertia@latest @inertiajs/react@latest
```

**Issue**: "QR code generation fails"
**Solution**: Install canvas dependencies (system level):
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib

# Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Issue**: "Stripe webhook signature verification fails"
**Solution**: Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3333/webhooks/stripe
# Copy webhook secret to .env
```

---

## Next Steps

1. ✅ Environment setup complete
2. 📝 Implement User Story 1 (Landing Page Creation) - see [spec.md](./spec.md)
3. 📝 Implement User Story 2 (Link Shortening & Analytics)
4. 📝 Implement User Story 3 (QR Code Generation)
5. 📝 Implement User Story 4 (Virtual Card E-commerce)
6. 📝 Implement User Story 5 (Advanced Configuration)
7. 🚀 Deploy to Railway production

For detailed task breakdown, run:
```bash
# Generate task list from spec
/speckit.tasks
```

---

## Useful Resources

- [AdonisJS Documentation](https://docs.adonisjs.com/guides/introduction)
- [Inertia.js Documentation](https://inertiajs.com/)
- [ShadcnUI Components](https://ui.shadcn.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Railway Documentation](https://docs.railway.app/)
- [Playwright Documentation](https://playwright.dev/)

---

**Happy Coding!** 🚀
