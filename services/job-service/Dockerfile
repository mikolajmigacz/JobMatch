FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/job-service/package.json services/job-service/
RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY services/job-service services/job-service
RUN pnpm -r build

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache curl

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/shared/package.json packages/shared/
COPY services/job-service/package.json services/job-service/
RUN corepack enable && corepack prepare pnpm@8.15.1 --activate && \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/services/job-service/dist/services/job-service/src/ ./services/job-service/dist/
COPY --from=builder /app/packages/shared/dist/ ./packages/shared/dist/
COPY tsconfig.base.json ./
COPY services/job-service/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3003/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "services/job-service/dist/main.js"]
