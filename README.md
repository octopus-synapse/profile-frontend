# ProFile Frontend v2

A modern, clean frontend for the ProFile platform built with Next.js 16, TypeScript, and TailwindCSS.

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router (pages only)
├── config/                 # Environment, routes, constants
├── features/               # Feature-based modules (DDD)
│   ├── auth/              # Authentication feature
│   ├── navigation/        # Navigation and menu
│   ├── i18n/              # Internationalization
│   ├── admin/             # Admin panel
│   ├── profile/           # User profile
│   ├── resume/            # Resume management
│   └── onboarding/        # Onboarding flow
├── shared/                 # Shared utilities
│   ├── components/ui/     # Design system components
│   ├── hooks/             # Generic hooks
│   ├── lib/               # Third-party wrappers
│   ├── providers/         # React providers
│   ├── types/             # Shared types
│   └── utils/             # Utility functions
└── styles/                 # Global styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run type-check` | Run TypeScript check |
| `npm run test` | Run tests |

## 🎯 Milestones

- [x] **Milestone 0**: Foundation - Project setup, TypeScript strict, design system base
- [ ] **Milestone 1**: Auth & RBAC - NextAuth, middleware, role guards
- [ ] **Milestone 2**: Navigation - Navbar, routes, menu builder
- [ ] **Milestone 3**: i18n - Full translation coverage
- [ ] **Milestone 4**: API Layer - HTTP client, repositories
- [ ] **Milestone 5**: State Management - TanStack Query integration
- [ ] **Milestone 6**: Design System - Complete UI components
- [ ] **Milestone 7**: Admin Panel - Dashboard, user management
- [ ] **Milestone 8**: Protected Routes - Profile, resume, onboarding
- [ ] **Milestone 9**: Public Profile - SSR, SEO, templates
- [ ] **Milestone 10**: Tests & Quality - Coverage, CI/CD
- [ ] **Milestone 11**: Cleanup - Remove legacy, optimize bundle

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS 4
- **UI Components**: Radix UI + custom design system
- **Data Fetching**: TanStack Query
- **Auth**: NextAuth v5
- **Validation**: Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📐 Design Principles

- **Clean Code**: Following Robert Martin's principles
- **DDD**: Feature-based organization
- **GoF Patterns**: Factory, Strategy, Composite, Adapter
- **Type Safety**: Strict TypeScript, no `any`
- **Single Source of Truth**: One place for each concern
