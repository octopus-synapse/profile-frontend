# ProFile Frontend Monorepo

A modern, clean frontend monorepo for the ProFile platform built with Next.js 16, TypeScript, TailwindCSS, and a shared API client package.

## 📦 Monorepo Structure

```
profile-frontend/
├── apps/
│   ├── web/                    # Next.js web application
│   └── mobile/                 # (Future) React Native app
├── packages/
│   └── api-client/             # Shared API client (framework-agnostic)
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace config
└── README.md
```

## 🏗️ Web App Architecture (apps/web)

```
src/
├── app/                    # Next.js App Router (pages only)
├── config/                 # Environment, routes, constants
├── features/               # Feature-based modules (Clean Architecture)
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Feature-specific components
│   │   ├── hooks/         # Feature-specific hooks
│   │   ├── services/      # API integration (uses @profile/api-client)
│   │   └── types/         # Feature-specific types
│   ├── navigation/        # Navigation and menu
│   ├── i18n/              # Internationalization
│   ├── admin/             # Admin panel
│   ├── profile/           # User profile
│   ├── resume/            # Resume management
│   └── onboarding/        # Onboarding flow
├── shared/                 # Shared utilities
│   ├── components/ui/     # Design system components
│   ├── hooks/             # Generic hooks
│   ├── lib/               # Third-party wrappers (api-client setup)
│   ├── providers/         # React providers
│   ├── types/             # Shared types
│   └── utils/             # Utility functions
└── styles/                 # Global styles
```

## 📦 API Client Package (packages/api-client)

Framework-agnostic HTTP client that works with Next.js, React Native, and any JS/TS environment.

```typescript
import { apiClient } from "@/shared/lib/api-client";

// Usage in Next.js
const user = await apiClient.users.getMe();
const resumes = await apiClient.resumes.getAll();
const themes = await apiClient.themes.getSystem();
```

See [packages/api-client/README.md](packages/api-client/README.md) for full documentation.

## 🚀 Getting Started

```bash
# Install dependencies (from root)
pnpm install

# Build api-client first
pnpm --filter @profile/api-client build

# Copy environment variables
cp apps/web/.env.example apps/web/.env.local

# Start development server
pnpm dev
```

## 📜 Scripts

| Script               | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start web development server   |
| `pnpm build`         | Build all packages and apps    |
| `pnpm lint`          | Run ESLint across workspace    |
| `pnpm lint:fix`      | Fix ESLint issues              |
| `pnpm format`        | Format with Prettier           |
| `pnpm type-check`    | Run TypeScript check           |
| `pnpm test`          | Run tests                      |
| `pnpm clean`         | Clean all build outputs        |

### Package-specific scripts

```bash
# Build only api-client
pnpm --filter @profile/api-client build

# Dev mode for api-client (watch)
pnpm --filter @profile/api-client dev

# Run only web app
pnpm --filter @profile/web dev
```

## 🎯 Milestones

- [x] **Milestone 0**: Foundation - Project setup, TypeScript strict, design system base
- [x] **Milestone 1**: Monorepo - pnpm workspace, api-client package
- [ ] **Milestone 2**: Auth & RBAC - NextAuth, middleware, role guards
- [ ] **Milestone 3**: Navigation - Navbar, routes, menu builder
- [ ] **Milestone 4**: i18n - Full translation coverage
- [x] **Milestone 5**: API Layer - HTTP client, repositories (via @profile/api-client)
- [ ] **Milestone 6**: State Management - TanStack Query integration
- [ ] **Milestone 7**: Design System - Complete UI components
- [ ] **Milestone 8**: Admin Panel - Dashboard, user management
- [ ] **Milestone 9**: Protected Routes - Profile, resume, onboarding
- [ ] **Milestone 10**: Public Profile - SSR, SEO, templates
- [ ] **Milestone 11**: Tests & Quality - Coverage, CI/CD
- [ ] **Milestone 12**: Mobile - React Native app setup

## 🛠️ Tech Stack

- **Monorepo**: pnpm workspaces
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI + custom design system
- **Data Fetching**: TanStack Query
- **Auth**: NextAuth v5
- **Validation**: Zod
- **HTTP Client**: Axios (via @profile/api-client)
- **Icons**: Lucide React
- **Build**: tsup (for packages)

## 📐 Design Principles

- **Clean Architecture**: Clear separation of concerns
- **DDD**: Feature-based organization
- **GoF Patterns**: Factory, Strategy, Composite, Adapter
- **Type Safety**: Strict TypeScript, no `any`
- **Single Source of Truth**: One place for each concern
- **Shared Code**: API client reusable across platforms
