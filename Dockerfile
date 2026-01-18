# ==================================
# Stage 1: Dependencies
# ==================================
FROM oven/bun:1.2.23 AS deps

# Install git to enable cloning sister repositories if they are missing from build context
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Handle Sister Repositories (@octopus-synapse/profile-contracts and @octopus-synapse/profile-ui)
# These are required by profile-frontend but reside in separate repositories.
# We support two modes:
# 1. Monorepo Context (CI): Sister repos are already in the context.
# 2. Project Context (CD): Sister repos are missing and MUST be cloned.
RUN --mount=type=secret,id=github_token \
    GITHUB_TOKEN_VAL=$(cat /run/secrets/github_token) && \
    if [ -z "$GITHUB_TOKEN_VAL" ]; then echo "GITHUB_TOKEN secret is required" && exit 1; fi && \
    # Contracts
    git clone https://x-access-token:${GITHUB_TOKEN_VAL}@github.com/octopus-synapse/profile-contracts.git /app/profile-contracts && \
    # UI
    git clone https://x-access-token:${GITHUB_TOKEN_VAL}@github.com/octopus-synapse/profile-ui.git /app/profile-ui

# Prepare frontend workspace structure for caching
# We copy all package.json files first to leverage Docker layer caching
WORKDIR /app/profile-frontend
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/mobile/package.json ./apps/mobile/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/features/package.json ./packages/features/
COPY packages/stores/package.json ./packages/stores/
COPY packages/test-utils/package.json ./packages/test-utils/

# Provide GitHub Token for private packages if any
RUN --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      GITHUB_TOKEN_VAL=$(cat /run/secrets/github_token) && \
      echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN_VAL}" > .npmrc && \
      echo "@octopus-synapse:registry=https://npm.pkg.github.com" >> .npmrc; \
    fi && \
    bun install --frozen-lockfile && \
    rm -f .npmrc

# ==================================
# Stage 2: Builder
# ==================================
FROM oven/bun:1.2.23 AS builder

WORKDIR /app

# Use sister repositories from deps stage
COPY --from=deps /app/profile-contracts /app/profile-contracts
COPY --from=deps /app/profile-ui /app/profile-ui

# Copy frontend source code
WORKDIR /app/profile-frontend
COPY . .
# Carry over node_modules from deps stage
COPY --from=deps /app/profile-frontend/node_modules ./node_modules

# Build external dependencies first so they are available for frontend build
WORKDIR /app/profile-contracts
RUN bun run build

WORKDIR /app/profile-ui
RUN bun run build

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
CMD ["bun", "server.js"]
