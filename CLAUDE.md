# skypy Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-20

## Active Technologies

- TypeScript 5.3+ (Node.js 20 LTS) (001-linktree-clone)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.3+ (Node.js 20 LTS): Follow standard conventions

## Recent Changes

- 001-linktree-clone: Added TypeScript 5.3+ (Node.js 20 LTS)

<!-- MANUAL ADDITIONS START -->

## Console Verification (MANDATORY)

**IMPORTANT**: After any change (code, configuration, database), you MUST systematically verify the application using the MCP Chrome DevTools.

### Verification Steps:

1. **Check Server Logs**:
   - View logs of the running development server
   - Look for errors, warnings, or stack traces
   - Verify no compilation errors

2. **Open Browser**:
   ```bash
   open http://localhost:3333
   ```

3. **Verify Browser Console** (MCP Chrome DevTools):
   - Check for JavaScript errors
   - Check for CSS/styling errors
   - Check for network errors (failed API calls)
   - Check for React warnings
   - Verify all resources load (CSS, JS, images)

4. **Verify Network Tab**:
   - Check that all resources load correctly
   - Verify API endpoints return correct responses
   - Check for 404 or 500 errors

5. **Test Core Functionality**:
   - Navigate to key pages (home, login, dashboard)
   - Test user interactions
   - Verify forms submit correctly
   - Check database operations work

## TailwindCSS v4 Configuration

**IMPORTANT**: The project uses TailwindCSS v4, which has breaking changes from v3.

### PostCSS Configuration

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // Required for v4
    autoprefixer: {},
  },
}
```

### CSS Limitations

TailwindCSS v4 cannot use `@apply` directives with custom CSS variables in `@layer base`:

```css
/* ❌ Does NOT work in v4 */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* ✅ Alternative: Use native CSS properties */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}

/* ✅ Best solution: Remove problematic @layer base rules */
/* Let TailwindCSS handle defaults */
```

## Database Configuration (Neon PostgreSQL)

### Project Details

- **Project Name**: skypy
- **Project ID**: `hidden-wind-70331604`
- **Region**: `aws-us-east-2` (US East Ohio)
- **Database**: `skypy_dev`

### Connection String Format

```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

**Important**:
- Always use the **pooled connection** string
- SSL is required (`sslmode=require`)
- Channel binding is required

### Database Models

- **Primary Keys**: Always use UUID (`uuid_generate_v4()`)
- **Timestamps**: Use `DateTime` from Luxon
- **Relationships**: Use CASCADE deletion for foreign keys
- **Snake Case**: Database columns use snake_case
- **Camel Case**: TypeScript properties use camelCase

## Known Issues

1. **TailwindCSS v4 `@apply` limitations**: Cannot use `@apply` with custom CSS variables in base layer - solution is to remove the problematic `@layer base` rules
2. **Product model**: Not yet implemented (Phase 6), currently commented out in User model with TODO comments

## Development Stack

- **Backend**: AdonisJS 6 with TypeScript
- **Frontend**: React 19 + Inertia.js
- **UI**: ShadcnUI + TailwindCSS v4 + Radix UI
- **Database**: Neon PostgreSQL (serverless)
- **Deployment**: Railway
- **Linting**: Biome
- **Testing**: Japa + Playwright

## Testing Checklist (Before Commits)

1. ✅ Server starts without errors
2. ✅ Application loads in browser
3. ✅ No console errors (verified with MCP Chrome DevTools)
4. ✅ All pages render correctly
5. ✅ Forms work and validate correctly
6. ✅ Database operations succeed
7. ✅ Linting passes (`npm run lint`)
8. ✅ Type checking passes (`npm run typecheck`)

<!-- MANUAL ADDITIONS END -->
