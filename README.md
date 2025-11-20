# Skypy - Linktree Clone with Advanced Features

A modern link-in-bio platform built with AdonisJS 6, Inertia.js, React, and Tailwind CSS. Create beautiful landing pages, shorten links, generate QR codes, and sell virtual card products.

## Features (MVP - User Story 1 Completed)

### ✅ Implemented

- **User Authentication**
  - Email/password registration and login
  - Session-based authentication
  - Account tier system (free/premium)

- **Landing Page Creation**
  - Create custom link-in-bio pages with unique slugs
  - Add profile name and bio
  - Manage multiple pages per account

- **Link Management**
  - Add unlimited links to your landing pages
  - Auto-generated short codes with nanoid
  - Click count tracking
  - Link descriptions and titles
  - Enable/disable links

- **Page Editor**
  - Live preview panel
  - Real-time updates as you edit
  - Add/remove links with instant feedback
  - View statistics (clicks, views)

- **Public Landing Pages**
  - Clean, responsive design
  - Customizable themes (colors, button styles)
  - SEO-friendly pages
  - View count tracking

### 🚧 Planned Features

- **Analytics Dashboard** (Phase 4)
  - Click tracking with charts
  - Geographic data
  - Device breakdown
  - Referrer tracking

- **QR Code Generation** (Phase 5)
  - Customizable QR codes
  - Logo embedding
  - Multiple export formats

- **E-commerce** (Phase 6)
  - Virtual card products
  - Stripe integration
  - Order management

- **Advanced Configuration** (Phase 7)
  - Custom CSS
  - Redirect rules
  - Webhooks

## Tech Stack

- **Backend**: AdonisJS 6 with TypeScript
- **Frontend**: React 19 + Inertia.js
- **UI**: ShadcnUI + Tailwind CSS + Radix UI
- **Database**: Neon PostgreSQL (serverless)
- **Deployment**: Railway
- **Linting**: Biome
- **Testing**: Japa + Playwright

## Project Structure

```
skypy/
├── app/
│   ├── controllers/       # HTTP controllers
│   ├── models/            # Lucid ORM models
│   ├── services/          # Business logic
│   ├── validators/        # VineJS validators
│   └── middleware/        # Custom middleware
├── database/
│   └── migrations/        # Database migrations
├── inertia/
│   ├── components/        # React components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Inertia pages
│   └── lib/               # Utilities
├── config/                # Configuration files
├── start/                 # Application bootstrap
└── specs/                 # Feature specifications
```

## Getting Started

### Prerequisites

- Node.js 20 LTS
- Neon PostgreSQL account (free tier)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skypy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Set up Neon database**
   - Sign up at https://neon.tech
   - Create a new project
   - Create database "skypy_dev"
   - Copy pooled connection string to `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/skypy_dev?sslmode=require
     ```

5. **Run migrations**
   ```bash
   node ace migration:run
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   Navigate to http://localhost:3333

### First Steps

1. Register a new account at `/auth/register`
2. Log in at `/auth/login`
3. Create your first landing page at `/pages/create`
4. Add links to your page
5. View your public page at `/:slug`

## Development

### Available Commands

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run Biome linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Biome
npm run typecheck        # Check TypeScript types

# Database
node ace migration:run   # Run migrations
node ace migration:fresh # Drop all tables and re-migrate
node ace db:seed         # Seed database

# Testing
npm test                 # Run tests
npx playwright test      # Run E2E tests
```

### Database Schema

The application uses UUID primary keys for all tables:

- **users**: User accounts with auth
- **landing_pages**: Link-in-bio pages
- **links**: Individual links with short codes
- **click_events**: Analytics tracking (Phase 4)
- **qr_codes**: Generated QR codes (Phase 5)
- **products**: Virtual card products (Phase 6)
- **orders**: E-commerce orders (Phase 6)

## Deployment

### Railway + Neon

1. **Connect to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Set environment variables**
   - `DATABASE_URL`: Your Neon pooled connection string
   - `APP_KEY`: Generate with `node ace generate:key`
   - `NODE_ENV`: production
   - `APP_URL`: Your Railway domain

3. **Deploy**
   ```bash
   railway up
   ```

4. **Run migrations on Railway**
   ```bash
   railway run node ace migration:run --force
   ```

## Progress

### Completed: 58/140 tasks (41%)

- ✅ Phase 1: Setup (12 tasks)
- ✅ Phase 2: Foundational (15 tasks)
- ✅ Phase 3: User Story 1 - Landing Pages (31 tasks)
- 🚧 Phase 4: User Story 2 - Analytics (20 tasks)
- 🚧 Phase 5: User Story 3 - QR Codes (12 tasks)
- 🚧 Phase 6: User Story 4 - E-commerce (22 tasks)
- 🚧 Phase 7: User Story 5 - Advanced Config (16 tasks)
- 🚧 Phase 8: Polish (12 tasks)

### Git Commits

```
7b99263 feat(public): add public landing page view
dd3168f feat(frontend): add pages management interface
0c51d2a feat(pages): add landing page controllers, services, and validators
b694e4f feat(models): add LandingPage and Link models with migrations
3684eb0 feat(auth): implement user authentication system
d353964 feat(foundation): add layouts, UI components, and middleware
d61acb5 feat(setup): initialize AdonisJS project with Inertia, React, and Tailwind
```

## Documentation

- [Quickstart Guide](./specs/001-linktree-clone/quickstart.md)
- [Feature Specification](./specs/001-linktree-clone/spec.md)
- [Data Model](./specs/001-linktree-clone/data-model.md)
- [Implementation Plan](./specs/001-linktree-clone/plan.md)
- [Task List](./specs/001-linktree-clone/tasks.md)

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using AdonisJS, Inertia.js, and React**
