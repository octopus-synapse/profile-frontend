# ==================================
# Stage 1: Dependencies
# ==================================
FROM oven/bun:1.2.23 AS deps

# Install git and build essentials
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Handle Context Normalization and Sister Repositories
# Supports both Monorepo Context (CI) and Project Root Context (CD)
RUN --mount=type=bind,target=/context \
    --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      GITHUB_TOKEN_VAL=$(cat /run/secrets/github_token); \
    fi && \
    # 1. Normalize profile-frontend location
    if [ -f "/context/profile-frontend/package.json" ]; then \
        echo "Detected Monorepo Context" && \
        mkdir -p /app/profile-frontend && cp -a /context/profile-frontend/. /app/profile-frontend/; \
        if [ -d "/context/profile-ui" ] && [ -f "/context/profile-ui/package.json" ]; then \
            echo "Copying profile-ui from context" && \
            mkdir -p /app/profile-ui && cp -a /context/profile-ui/. /app/profile-ui/; \
        fi; \
    else \
        echo "Detected Project Root Context" && \
        mkdir -p /app/profile-frontend && cp -a /context/. /app/profile-frontend/; \
    fi && \
    # 2. Self-healing: Clone missing profile-ui if GITHUB_TOKEN is available
    if [ -n "$GITHUB_TOKEN_VAL" ]; then \
        if [ ! -f "/app/profile-ui/package.json" ]; then \
            echo "Cloning profile-ui..." && rm -rf /app/profile-ui && \
            git clone https://x-access-token:${GITHUB_TOKEN_VAL}@github.com/octopus-synapse/profile-ui.git /app/profile-ui; \
        fi; \
    elif [ ! -f "/app/profile-ui/package.json" ]; then \
        echo "ERROR: profile-ui missing and no GITHUB_TOKEN for cloning" && exit 1; \
    fi

# Step 2: Install dependencies for all
RUN --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      GITHUB_TOKEN_VAL=$(cat /run/secrets/github_token) && \
      echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN_VAL}" > ~/.npmrc && \
      echo "@octopus-synapse:registry=https://npm.pkg.github.com" >> ~/.npmrc; \
    fi && \
    # UI
    echo "Installing @octopus-synapse/profile-ui..." && \
    cd /app/profile-ui && (bun install --frozen-lockfile || bun install) && \
    # Frontend
    echo "Installing profile-frontend..." && \
    cd /app/profile-frontend && (bun install --frozen-lockfile || bun install) && \
    rm -f ~/.npmrc

# ==================================
# Stage 2: Builder
# ==================================
FROM oven/bun:1.2.23 AS builder

WORKDIR /app

# Copy EVERYTHING from deps stage (source + node_modules)
COPY --from=deps /app /app

# Build external dependencies first so they are available for frontend build
WORKDIR /app/profile-ui
RUN bun run build

# Build internal frontend dependencies
WORKDIR /app/profile-frontend
# Refresh symlinks and resolve sister-repo builds (crucial for type resolution)
RUN bun install
RUN mkdir -p /app/profile-frontend/node_modules/@octopus-synapse && \
    rm -rf /app/profile-frontend/node_modules/@octopus-synapse/profile-ui && \
    ln -s /app/profile-ui /app/profile-frontend/node_modules/@octopus-synapse/profile-ui

# Build internal packages
RUN bun --filter @profile/api-client build
RUN bun --filter @profile/i18n build

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
# If FRONTEND_PORT is provided, prefer it to match VM port mapping.
CMD ["sh", "-c", "PORT=${FRONTEND_PORT:-$PORT} HOSTNAME=0.0.0.0 bun apps/web/server.js"]
