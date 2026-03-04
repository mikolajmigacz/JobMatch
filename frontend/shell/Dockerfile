# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@8.15.1

COPY .npmrc pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY frontend/shell/package.json ./frontend/shell/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json

RUN pnpm install --frozen-lockfile

COPY packages/shared/src ./packages/shared/src
COPY frontend/shell ./frontend/shell

ARG NEXT_PUBLIC_JOB_SEEKER_URL
ARG NEXT_PUBLIC_EMPLOYER_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_S3_BASE_URL
ARG BUILD_ID=dev
ENV NEXT_PUBLIC_JOB_SEEKER_URL=$NEXT_PUBLIC_JOB_SEEKER_URL
ENV NEXT_PUBLIC_EMPLOYER_URL=$NEXT_PUBLIC_EMPLOYER_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_S3_BASE_URL=$NEXT_PUBLIC_S3_BASE_URL
ENV NEXT_PUBLIC_BUILD_ID=$BUILD_ID

RUN pnpm --filter shell build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl && npm install -g pnpm@8.15.1

COPY --from=builder /app/frontend/shell/.next ./frontend/shell/.next
COPY --from=builder /app/frontend/shell/public ./frontend/shell/public
COPY --from=builder /app/frontend/shell/package.json ./frontend/shell/package.json
COPY --from=builder /app/frontend/shell/next.config.js ./frontend/shell/next.config.js
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.base.json ./

RUN pnpm install --frozen-lockfile --prod

WORKDIR /app/frontend/shell

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=15s \
    CMD curl -f http://localhost:4000/ || exit 1

CMD ["pnpm", "start"]
