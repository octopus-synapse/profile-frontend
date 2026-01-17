# ==================================
# Stage 1: Dependencies
# ==================================
FROM oven/bun:1.2.23-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app/frontend

# Copy sibling dependencies needed for workspace installation
# Context is the root of the workspace in CI
COPY profile-contracts /profile-contracts
COPY profile-ui /profile-ui

# Copy frontend workspace configuration
COPY profile-frontend/package.json profile-frontend/bun.lock ./
COPY profile-frontend/apps/web/package.json ./apps/web/
COPY profile-frontend/apps/mobile/package.json ./apps/mobile/
COPY profile-frontend/packages/api-client/package.json ./packages/api-client/
COPY profile-frontend/packages/features/package.json ./packages/features/
COPY profile-frontend/packages/stores/package.json ./packages/stores/
COPY profile-frontend/packages/test-utils/package.json ./packages/test-utils/

# Install dependencies
RUN bun install --frozen-lockfile

# ==================================
# Stage 2: Builder
# ==================================
FROM oven/bun:1.2.23-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy all from context
COPY profile-contracts /profile-contracts
COPY profile-ui /profile-ui
COPY profile-frontend /app/frontend

# Copy node_modules from deps stage
COPY --from=deps /app/frontend/node_modules /app/frontend/node_modules

WORKDIR /app/frontend

# Build internal dependencies
RUN bun --filter @profile/api-client build
RUN bun --filter @profile/stores build

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN bun --filter @profile/web build

# ==================================
# Stage 3: Runner
# ==================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
# Next.js standalone output preserves monorepo structure
COPY --from=builder /app/frontend/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
