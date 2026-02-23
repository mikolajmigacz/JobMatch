# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.1

# Copy workspace files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY frontend/job-seeker-module/package.json ./frontend/job-seeker-module/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json

# Install dependencies (frozen for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy packages/shared source
COPY packages/shared/src ./packages/shared/src

# Copy frontend source
COPY frontend/job-seeker-module ./frontend/job-seeker-module

# Build
RUN pnpm --filter job-seeker-module build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

RUN npm install -g pnpm@8.15.1

COPY --from=builder /app/frontend/job-seeker-module/.next ./frontend/job-seeker-module/.next
COPY --from=builder /app/frontend/job-seeker-module/public ./frontend/job-seeker-module/public
COPY --from=builder /app/frontend/job-seeker-module/package.json ./frontend/job-seeker-module/package.json
COPY --from=builder /app/frontend/job-seeker-module/next.config.js ./frontend/job-seeker-module/next.config.js
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.base.json ./

RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/frontend/job-seeker-module

EXPOSE 4001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
    CMD node -e "require('http').get('http://localhost:4001/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["pnpm", "start"]
