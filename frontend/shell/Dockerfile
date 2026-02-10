# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.1

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY frontend/shell/package.json ./frontend/shell/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json

# Install dependencies (frozen for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy packages/shared source
COPY packages/shared/src ./packages/shared/src

# Copy frontend shell source
COPY frontend/shell ./frontend/shell

# Build shell frontend
RUN pnpm --filter shell build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Install pnpm in runtime
RUN npm install -g pnpm@8.15.1

# Copy only production dependencies and build artifacts
COPY --from=builder /app/frontend/shell/.next ./frontend/shell/.next
COPY --from=builder /app/frontend/shell/public ./frontend/shell/public
COPY --from=builder /app/frontend/shell/package.json ./frontend/shell/package.json
COPY --from=builder /app/frontend/shell/next.config.js ./frontend/shell/next.config.js
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.base.json ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/frontend/shell

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
    CMD node -e "require('http').get('http://localhost:4000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["pnpm", "start"]
