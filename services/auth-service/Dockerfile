# Multi-stage build for auth-service
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

# Copy package manifests only (no node_modules)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/auth-service/package.json services/auth-service/

# Install all dependencies (workspace + service)
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

# Copy node_modules and pnpm store from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/services/auth-service/node_modules ./services/auth-service/node_modules

# Copy source files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared packages/shared
COPY services/auth-service services/auth-service
COPY tsconfig.base.json ./

# Build shared package first (if exists)
RUN if [ -d "packages/shared/src" ]; then cd packages/shared && pnpm run build; fi

# Build auth-service
RUN cd services/auth-service && pnpm run build && node fix-paths.js

# Stage 3: Production Runtime
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl

# Copy package manifests
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/auth-service/package.json services/auth-service/

# Install only production dependencies using pnpm
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate && \
    pnpm install --frozen-lockfile --prod

# Copy built auth-service and shared package from builder
COPY --from=builder /app/services/auth-service/dist ./services/auth-service/dist
COPY --from=builder /app/services/auth-service/tsconfig.json ./services/auth-service/tsconfig.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY tsconfig.base.json ./

# Create .mocharc or similar for loading tsconfig-paths
RUN echo '{"require": ["tsconfig-paths/register"]}' > .ts-node.json

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Start application (paths already fixed in compiled code, no need for tsconfig-paths at runtime)
CMD ["node", "services/auth-service/dist/main.js"]
