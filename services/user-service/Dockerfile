FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/user-service/package.json services/user-service/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY services/user-service services/user-service
RUN pnpm -r build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/user-service/package.json services/user-service/
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate && \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/services/user-service/dist/ ./services/user-service/dist/
COPY --from=builder /app/packages/shared/dist/ ./packages/shared/dist/
COPY tsconfig.base.json ./

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

CMD ["node", "services/user-service/dist/services/user-service/src/main.js"]
