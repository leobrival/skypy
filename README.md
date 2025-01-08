# Skypy - Digital Business Card Platform

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- pnpm

### Environment Setup

1. Clone the repository:
```bash
git clone git@github.com:leobrival/skypy.git
cd skypy
```

2. Copy environment files:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
pnpm install
```

### Launch Supabase Services

Start all Supabase services using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Supabase Studio (port 3000)
- Authentication service
- REST API
- Realtime subscriptions
- Storage API

### Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Environment Variables

The project uses strong environment variable validation with Zod. Key variables include:

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `POSTGRES_PASSWORD`: Database password
- `JWT_SECRET`: 32+ character secret for JWT
- `ANON_KEY`: Supabase anonymous key
- `SERVICE_ROLE_KEY`: Supabase service role key

### Optional Variables
- Email configuration (SMTP)
- Redis configuration
- Storage backend configuration

See `.env.example` for all available options.

## 🛠 Development Tools

- **TypeScript**: Strict mode enabled
- **Zod**: Runtime type validation
- **ESLint & Prettier**: Code formatting
- **Docker**: Development services
- **Supabase**: Backend services

## 📚 Documentation

- [Project Overview](./DEEVBOOK.md)
- [Development Worksheet](./WORKSHEET.md)

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e
```

## 📦 Production Deployment

1. Build the application:
```bash
pnpm build
```

2. Start production server:
```bash
pnpm start
```

## 🤝 Contributing

Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
