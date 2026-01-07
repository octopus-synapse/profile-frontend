# ==================================
# Stage 1: Dependencies
# ==================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/

# Install dependencies with GitHub Packages authentication using secrets
RUN --mount=type=secret,id=github_token \
    if [ -s /run/secrets/github_token ]; then \
      GITHUB_TOKEN=$(cat /run/secrets/github_token) && \
      echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc && \
      echo "@octopus-synapse:registry=https://npm.pkg.github.com" >> .npmrc; \
    fi && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

# ==================================
# Stage 2: Builder
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/api-client/node_modules ./packages/api-client/node_modules

# Copy source code
COPY . .

# Build api-client first (workspace dependency)
RUN pnpm --filter @profile/api-client build

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm --filter @profile/web build

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
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
