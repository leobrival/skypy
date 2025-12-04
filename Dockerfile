# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Set NODE_ENV to development for build (to install devDependencies)
ENV NODE_ENV=development

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Set NODE_ENV to production for runtime
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built application from builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3333

# Start the application
CMD ["node", "build/bin/server.js"]
