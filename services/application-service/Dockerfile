FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/application-service/package.json services/application-service/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY services/application-service services/application-service
RUN pnpm -r build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/application-service/package.json services/application-service/
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate && \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/services/application-service/dist/ ./services/application-service/dist/
COPY --from=builder /app/packages/shared/dist/ ./packages/shared/dist/
COPY tsconfig.base.json ./

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3004/health || exit 1

CMD ["node", "services/application-service/dist/services/application-service/src/main.js"]
