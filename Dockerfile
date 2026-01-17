# ==================================
# Stage 1: Dependencies
# ==================================
FROM oven/bun:1.2.23 AS deps

WORKDIR /app

# Copy sibling dependencies EXACTLY as siblings for relative path resolution
# Concepts: relative path mapping for ../profile-contracts and ../profile-ui
COPY profile-contracts/ ./profile-contracts/
COPY profile-ui/ ./profile-ui/

# Prepare frontend workspace structure for caching
WORKDIR /app/profile-frontend
COPY profile-frontend/package.json profile-frontend/bun.lock ./
COPY profile-frontend/apps/web/package.json ./apps/web/
COPY profile-frontend/apps/mobile/package.json ./apps/mobile/
COPY profile-frontend/packages/api-client/package.json ./packages/api-client/
COPY profile-frontend/packages/features/package.json ./packages/features/
COPY profile-frontend/packages/stores/package.json ./packages/stores/
COPY profile-frontend/packages/test-utils/package.json ./packages/test-utils/

# Provide GitHub Token for private packages if any
RUN --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
      echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc && \
      echo "@octopus-synapse:registry=https://npm.pkg.github.com" >> .npmrc; \
    fi && \
    bun install --frozen-lockfile && \
    rm -f .npmrc

# ==================================
# Stage 2: Builder
# ==================================
FROM oven/bun:1.2.23 AS builder

WORKDIR /app

# Copy all source code maintaining same sibling structure as build context
COPY profile-contracts/ ./profile-contracts/
COPY profile-ui/ ./profile-ui/
COPY profile-frontend/ ./profile-frontend/

# Carry over node_modules from deps stage
COPY --from=deps /app/profile-frontend/node_modules ./profile-frontend/node_modules

# Build external dependencies first so they are available for frontend build
WORKDIR /app/profile-contracts
# Ensure we use the built version of sister packages
RUN bun install --frozen-lockfile && bun run build

WORKDIR /app/profile-ui
RUN bun install --frozen-lockfile && bun run build

# Build internal frontend dependencies
WORKDIR /app/profile-frontend
# Refresh symlinks and ensure everything is built in order
RUN bun install
RUN bun --filter @profile/api-client build
RUN bun --filter @profile/stores build

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN bun --filter @profile/web build

# ==================================
# Stage 3: Runner
# ==================================
FROM oven/bun:1.2.23-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built application components
COPY --from=builder /app/profile-frontend/apps/web/public ./apps/web/public
COPY --from=builder /app/profile-frontend/apps/web/.next/standalone ./
COPY --from=builder /app/profile-frontend/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Pure Bun execution for the production server
CMD ["bun", "apps/web/server.js"]
