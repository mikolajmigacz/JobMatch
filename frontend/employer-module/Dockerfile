# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@8.15.1

COPY .npmrc pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json .prettierrc.json ./
COPY frontend/employer-module/package.json ./frontend/employer-module/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json

RUN pnpm install --frozen-lockfile

COPY packages/shared/src ./packages/shared/src
COPY frontend/employer-module ./frontend/employer-module

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm --filter employer-module build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl && npm install -g pnpm@8.15.1

COPY --from=builder /app/frontend/employer-module/.next ./frontend/employer-module/.next
COPY --from=builder /app/frontend/employer-module/public ./frontend/employer-module/public
COPY --from=builder /app/frontend/employer-module/package.json ./frontend/employer-module/package.json
COPY --from=builder /app/frontend/employer-module/next.config.js ./frontend/employer-module/next.config.js
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.base.json ./

RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/frontend/employer-module

EXPOSE 4002

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
    CMD curl -f http://localhost:4002/ || exit 1

CMD ["pnpm", "start"]
