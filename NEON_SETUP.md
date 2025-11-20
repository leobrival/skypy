# Neon PostgreSQL Setup

This document tracks the Neon database configuration for the Skypy project.

## Project Details

- **Project Name**: skypy
- **Project ID**: `hidden-wind-70331604`
- **Region**: `aws-us-east-2` (US East Ohio)
- **Database**: `skypy_dev`
- **Owner**: `neondb_owner`
- **Created**: 2025-11-20

## Connection Details

### Pooled Connection (Recommended for Serverless)
```
postgresql://neondb_owner:npg_mWHXA3P9uqEo@ep-wispy-wind-aekvfai1-pooler.c-2.us-east-2.aws.neon.tech/skypy_dev?sslmode=require&channel_binding=require
```

**Note**: This connection string is already configured in `.env` as `DATABASE_URL`

## Database Schema

The following tables have been created via AdonisJS migrations:

1. **users** (UUID primary key)
   - Authentication and account management
   - Fields: id, email, username, password_hash, account_tier, etc.

2. **landing_pages** (UUID primary key)
   - Link-in-bio pages
   - Fields: id, user_id, slug, profile_name, bio, theme_config (JSONB), etc.

3. **links** (UUID primary key)
   - Individual links for landing pages
   - Fields: id, user_id, landing_page_id, title, destination_url, short_code, etc.

## Neon CLI Commands

### Authentication
```bash
neonctl auth
neonctl me
```

### Project Management
```bash
# List projects
neonctl projects list

# View project details
neonctl projects get hidden-wind-70331604
```

### Database Management
```bash
# List databases
neonctl databases list --project-id hidden-wind-70331604

# Get connection string
neonctl connection-string --project-id hidden-wind-70331604 --database-name skypy_dev --pooled
```

### Database Branches (Advanced)
```bash
# Create development branch
neonctl branches create --project-id hidden-wind-70331604 --name dev

# Create staging branch
neonctl branches create --project-id hidden-wind-70331604 --name staging
```

## Migration Status

All migrations completed successfully:

```
✓ 1763650730650_create_add_uuid_extensions_table
✓ 1763650749216_create_create_users_table
✓ 1763652783105_create_create_landing_pages_table
✓ 1763652784338_create_create_links_table
```

## Neon Features Used

- **Serverless PostgreSQL**: Auto-scaling based on usage
- **Pooled Connections**: Connection pooling handled by Neon
- **Free Tier**: 0.5GB storage, 100 compute hours/month
- **SSL Required**: Secure connections enforced

## Production Setup

For production deployment:

1. Create a new Neon project or branch for production
2. Update environment variables on Railway:
   ```
   DATABASE_URL=<neon-production-connection-string>
   ```
3. Run migrations on production:
   ```bash
   railway run node ace migration:run --force
   ```

## Troubleshooting

### Connection Issues
- Ensure `sslmode=require` is in connection string
- Use pooled connection for better performance
- Check firewall rules if connecting from restricted network

### Migration Issues
- Run `node ace migration:status` to check current state
- Use `node ace migration:fresh` to reset database (development only)
- Check Neon dashboard for connection limits

## Resources

- Neon Dashboard: https://console.neon.tech
- Neon Documentation: https://neon.tech/docs
- AdonisJS Lucid: https://docs.adonisjs.com/guides/database
