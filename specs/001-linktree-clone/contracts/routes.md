# Application Routes: Linktree Clone

**Feature**: 001-linktree-clone
**Date**: 2025-11-20
**Framework**: AdonisJS 6 + Inertia.js

## Overview

This document defines all application routes. Since we're using Inertia.js, routes return Inertia responses (server-side rendering with client-side transitions) rather than REST API responses.

**Route Conventions**:
- **Web Routes**: Return Inertia pages (HTML + React props)
- **API Routes**: JSON responses (for AJAX calls, webhooks)
- **Public Routes**: Accessible without authentication
- **Protected Routes**: Require authenticated user

---

## Route Groups

### Authentication Routes

**Prefix**: `/auth`
**Middleware**: `guest` (redirect to dashboard if already logged in)

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | /register | AuthController | showRegister | Show registration form | auth/register.tsx |
| POST | /register | AuthController | register | Process registration | Redirect to /dashboard |
| GET | /login | AuthController | showLogin | Show login form | auth/login.tsx |
| POST | /login | AuthController | login | Process login | Redirect to /dashboard |
| POST | /logout | AuthController | logout | Logout user | Redirect to / |
| GET | /verify-email/:token | AuthController | verifyEmail | Verify email address | Redirect to /dashboard |
| GET | /forgot-password | AuthController | showForgotPassword | Show password reset form | auth/forgot-password.tsx |
| POST | /forgot-password | AuthController | sendResetLink | Send reset link email | Redirect back with message |
| GET | /reset-password/:token | AuthController | showResetPassword | Show new password form | auth/reset-password.tsx |
| POST | /reset-password | AuthController | resetPassword | Update password | Redirect to /login |

**OAuth Routes**:

| Method | Path | Controller | Action | Description |
| --- | --- | --- | --- | --- |
| GET | /auth/google | AuthController | redirectToGoogle | Initiate Google OAuth |
| GET | /auth/google/callback | AuthController | handleGoogleCallback | Handle OAuth callback |
| GET | /auth/github | AuthController | redirectToGithub | Initiate GitHub OAuth |
| GET | /auth/github/callback | AuthController | handleGithubCallback | Handle OAuth callback |

---

### Dashboard Routes

**Prefix**: `/dashboard`
**Middleware**: `auth` (requires authenticated user)

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | / | DashboardController | index | Main dashboard overview | dashboard/index.tsx |
| GET | /analytics | AnalyticsController | index | Analytics dashboard | dashboard/analytics.tsx |

---

### Landing Page Routes

**Prefix**: `/pages`
**Middleware**: `auth`

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | / | PagesController | index | List user's pages | pages/index.tsx |
| GET | /create | PagesController | create | Show page creation form | pages/create.tsx |
| POST | / | PagesController | store | Create new page | Redirect to /pages/:id/edit |
| GET | /:id | PagesController | show | View page details | pages/show.tsx |
| GET | /:id/edit | PagesController | edit | Edit page (live preview) | dashboard/editor.tsx |
| PUT | /:id | PagesController | update | Update page | Redirect back with message |
| DELETE | /:id | PagesController | destroy | Delete page | Redirect to /pages |
| POST | /:id/links | PagesController | addLink | Add link to page | JSON response (AJAX) |
| PUT | /:id/links/:linkId | PagesController | updateLink | Update link | JSON response (AJAX) |
| DELETE | /:id/links/:linkId | PagesController | removeLink | Remove link | JSON response (AJAX) |
| POST | /:id/links/reorder | PagesController | reorderLinks | Update link positions | JSON response (AJAX) |

---

### Link Shortening Routes

**Prefix**: `/links`
**Middleware**: `auth`

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | / | LinksController | index | List user's shortened links | links/index.tsx |
| GET | /create | LinksController | create | Show link shortening form | links/create.tsx |
| POST | / | LinksController | store | Create shortened link | Redirect to /links |
| GET | /:id | LinksController | show | View link details | links/show.tsx |
| GET | /:id/edit | LinksController | edit | Edit link | links/edit.tsx |
| PUT | /:id | LinksController | update | Update link | Redirect back with message |
| DELETE | /:id | LinksController | destroy | Delete link | Redirect to /links |

---

### QR Code Routes

**Prefix**: `/qr`
**Middleware**: `auth`

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | /generate/:linkId | QRCodesController | create | Show QR customization editor | qr/generate.tsx |
| POST | /generate/:linkId | QRCodesController | generate | Generate QR code | JSON response (returns file URL) |
| GET | /download/:id | QRCodesController | download | Download QR code file | Binary file response |

---

### Product & Shop Routes

**Prefix**: `/shop` (public), `/products` (seller dashboard)
**Middleware**: `auth` (for seller routes only)

**Public Shop Routes** (no auth required):

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | /shop | ProductsController | shop | Browse virtual card marketplace | shop/index.tsx |
| GET | /shop/:id | ProductsController | show | View product details | shop/show.tsx |
| POST | /shop/:id/checkout | ProductsController | createCheckoutSession | Initiate Stripe checkout | Redirect to Stripe |

**Seller Product Management Routes** (auth required):

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | /products | ProductsController | index | List seller's products | products/index.tsx |
| GET | /products/create | ProductsController | create | Show product creation form | products/create.tsx |
| POST | /products | ProductsController | store | Create new product | Redirect to /products |
| GET | /products/:id/edit | ProductsController | edit | Edit product | products/edit.tsx |
| PUT | /products/:id | ProductsController | update | Update product | Redirect back with message |
| DELETE | /products/:id | ProductsController | destroy | Delete product | Redirect to /products |

---

### Order Routes

**Prefix**: `/orders`
**Middleware**: `auth`

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | / | OrdersController | index | List seller's orders | orders/index.tsx |
| GET | /:id | OrdersController | show | View order details | orders/show.tsx |
| POST | /:id/refund | OrdersController | refund | Process refund | Redirect back with message |

**Order Activation Route** (public):

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | /activate/:token | OrdersController | activate | Activate purchased card | Redirect to /dashboard |

---

### Public Routes

**No authentication required**

| Method | Path | Controller | Action | Description | Inertia Page |
| --- | --- | --- | --- | --- | --- |
| GET | / | HomeController | index | Landing page | home.tsx |
| GET | /:slug | PublicPagesController | show | Public landing page view | public/[slug].tsx |

---

### Link Redirection Routes

**No authentication required**
**Middleware**: `analytics-tracker` (captures click event)

| Method | Path | Controller | Action | Description |
| --- | --- | --- | --- | --- |
| GET | /l/:shortCode | LinksController | redirect | Redirect to destination URL |

---

### Webhook Routes

**Prefix**: `/webhooks`
**Middleware**: None (verified via signature)

| Method | Path | Controller | Action | Description |
| --- | --- | --- | --- | --- |
| POST | /stripe | WebhooksController | handleStripe | Process Stripe webhook events |

---

## Route File Structure (start/routes.ts)

```typescript
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Public routes
router.get('/', [HomeController, 'index'])
router.get('/:slug', [PublicPagesController, 'show']).where('slug', /^[a-z0-9-]+$/)

// Link redirection (with analytics tracking)
router
  .get('/l/:shortCode', [LinksController, 'redirect'])
  .use(middleware.analyticsTracker())

// Authentication routes
router.group(() => {
  router.get('/register', [AuthController, 'showRegister'])
  router.post('/register', [AuthController, 'register'])
  router.get('/login', [AuthController, 'showLogin'])
  router.post('/login', [AuthController, 'login'])
  router.get('/verify-email/:token', [AuthController, 'verifyEmail'])
  router.get('/forgot-password', [AuthController, 'showForgotPassword'])
  router.post('/forgot-password', [AuthController, 'sendResetLink'])
  router.get('/reset-password/:token', [AuthController, 'showResetPassword'])
  router.post('/reset-password', [AuthController, 'resetPassword'])

  // OAuth routes
  router.get('/google', [AuthController, 'redirectToGoogle'])
  router.get('/google/callback', [AuthController, 'handleGoogleCallback'])
  router.get('/github', [AuthController, 'redirectToGithub'])
  router.get('/github/callback', [AuthController, 'handleGithubCallback'])
}).prefix('/auth').use(middleware.guest())

// Logout (authenticated only)
router.post('/auth/logout', [AuthController, 'logout']).use(middleware.auth())

// Dashboard routes (authenticated)
router.group(() => {
  router.get('/', [DashboardController, 'index'])
  router.get('/analytics', [AnalyticsController, 'index'])
}).prefix('/dashboard').use(middleware.auth())

// Landing page routes (authenticated)
router.group(() => {
  router.get('/', [PagesController, 'index'])
  router.get('/create', [PagesController, 'create'])
  router.post('/', [PagesController, 'store'])
  router.get('/:id', [PagesController, 'show']).where('id', router.matchers.uuid())
  router.get('/:id/edit', [PagesController, 'edit']).where('id', router.matchers.uuid())
  router.put('/:id', [PagesController, 'update']).where('id', router.matchers.uuid())
  router.delete('/:id', [PagesController, 'destroy']).where('id', router.matchers.uuid())

  // Link management (AJAX endpoints)
  router.post('/:id/links', [PagesController, 'addLink']).where('id', router.matchers.uuid())
  router.put('/:id/links/:linkId', [PagesController, 'updateLink']).where('id', router.matchers.uuid()).where('linkId', router.matchers.uuid())
  router.delete('/:id/links/:linkId', [PagesController, 'removeLink']).where('id', router.matchers.uuid()).where('linkId', router.matchers.uuid())
  router.post('/:id/links/reorder', [PagesController, 'reorderLinks']).where('id', router.matchers.uuid())
}).prefix('/pages').use(middleware.auth())

// Link shortening routes (authenticated)
router.group(() => {
  router.get('/', [LinksController, 'index'])
  router.get('/create', [LinksController, 'create'])
  router.post('/', [LinksController, 'store'])
  router.get('/:id', [LinksController, 'show']).where('id', router.matchers.uuid())
  router.get('/:id/edit', [LinksController, 'edit']).where('id', router.matchers.uuid())
  router.put('/:id', [LinksController, 'update']).where('id', router.matchers.uuid())
  router.delete('/:id', [LinksController, 'destroy']).where('id', router.matchers.uuid())
}).prefix('/links').use(middleware.auth())

// QR code routes (authenticated)
router.group(() => {
  router.get('/generate/:linkId', [QRCodesController, 'create']).where('linkId', router.matchers.uuid())
  router.post('/generate/:linkId', [QRCodesController, 'generate']).where('linkId', router.matchers.uuid())
  router.get('/download/:id', [QRCodesController, 'download']).where('id', router.matchers.uuid())
}).prefix('/qr').use(middleware.auth())

// Public shop routes
router.group(() => {
  router.get('/', [ProductsController, 'shop'])
  router.get('/:id', [ProductsController, 'show']).where('id', router.matchers.uuid())
  router.post('/:id/checkout', [ProductsController, 'createCheckoutSession']).where('id', router.matchers.uuid())
}).prefix('/shop')

// Seller product management (authenticated)
router.group(() => {
  router.get('/', [ProductsController, 'index'])
  router.get('/create', [ProductsController, 'create'])
  router.post('/', [ProductsController, 'store'])
  router.get('/:id/edit', [ProductsController, 'edit']).where('id', router.matchers.uuid())
  router.put('/:id', [ProductsController, 'update']).where('id', router.matchers.uuid())
  router.delete('/:id', [ProductsController, 'destroy']).where('id', router.matchers.uuid())
}).prefix('/products').use(middleware.auth())

// Order management (authenticated)
router.group(() => {
  router.get('/', [OrdersController, 'index'])
  router.get('/:id', [OrdersController, 'show']).where('id', router.matchers.uuid())
  router.post('/:id/refund', [OrdersController, 'refund']).where('id', router.matchers.uuid())
}).prefix('/orders').use(middleware.auth())

// Order activation (public)
router.get('/activate/:token', [OrdersController, 'activate'])

// Webhook routes (no auth, signature verification in controller)
router.post('/webhooks/stripe', [WebhooksController, 'handleStripe'])
```

---

## Middleware Pipeline

### Global Middleware (all routes)

1. `bodyParser` - Parse JSON/form bodies
2. `csrfProtection` - CSRF token validation (except webhooks)
3. `inertia` - Inertia.js request/response handling

### Route-Specific Middleware

- **`auth`**: Verify authenticated session (redirect to /login if not)
- **`guest`**: Redirect to /dashboard if already logged in
- **`analyticsTracker`**: Capture click event for link redirects
- **`rateLimiter`**: Prevent abuse (applied to sensitive endpoints)

---

## Rate Limiting Rules

| Endpoint | Limit | Window | Reason |
| --- | --- | --- | --- |
| POST /auth/register | 3 requests | 1 hour | Prevent spam accounts |
| POST /auth/login | 5 requests | 15 minutes | Brute force protection |
| POST /auth/forgot-password | 3 requests | 1 hour | Email bombing prevention |
| POST /links | 100 requests | 1 hour | Abuse prevention (free tier) |
| POST /qr/generate/:linkId | 50 requests | 1 hour | Resource-intensive operation |
| POST /shop/:id/checkout | 10 requests | 5 minutes | Payment fraud prevention |

---

## Error Handling

**Inertia Error Pages**:
- 404 Not Found → `inertia/pages/errors/404.tsx`
- 403 Forbidden → `inertia/pages/errors/403.tsx`
- 500 Server Error → `inertia/pages/errors/500.tsx`

**Validation Errors**:
- Returned as JSON with Inertia error bag
- Frontend displays errors via ShadcnUI form components

---

## CORS Configuration

**Allowed Origins**: Same-origin only (Inertia.js doesn't need CORS)
**Exception**: Webhook endpoints accept POST from Stripe IPs

---

## Next Steps

1. Implement controllers for each route group
2. Create Inertia pages for each view
3. Add form validators for POST/PUT requests
4. Set up rate limiting middleware
5. Configure error pages
