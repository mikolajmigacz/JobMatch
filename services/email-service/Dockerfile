FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/email-service/package.json services/email-service/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY services/email-service services/email-service
RUN pnpm -r build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/email-service/package.json services/email-service/
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate && \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/services/email-service/dist/ ./services/email-service/dist/
COPY --from=builder /app/packages/shared/dist/ ./packages/shared/dist/
COPY tsconfig.base.json ./

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3005/health || exit 1

CMD ["node", "services/email-service/dist/services/email-service/src/main.js"]
