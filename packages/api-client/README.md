# @profile/api-client

Framework-agnostic API client for Profile services. Works with Next.js, React Native, and any JavaScript/TypeScript environment.

## 📦 Installation

The package is part of the monorepo and is linked via pnpm workspace:

```json
{
 "dependencies": {
  "@profile/api-client": "workspace:*"
 }
}
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { createProfileApiClient } from "@profile/api-client";

const apiClient = createProfileApiClient({
 baseURL: "https://api.example.com",
 getToken: async () => localStorage.getItem("accessToken"),
});

// Use repositories
const user = await apiClient.users.getMe();
const resumes = await apiClient.resumes.getAll();
const themes = await apiClient.themes.getSystem();
```

### Next.js Integration

```typescript
// shared/lib/api-client.ts
import { createProfileApiClient } from "@profile/api-client";

export const apiClient = createProfileApiClient({
 baseURL: process.env.NEXT_PUBLIC_API_URL!,
 // Auth is handled via httpOnly session cookies
 onUnauthorized: () => {
  window.location.href = "/login";
 },
});
```

### React Native Integration

```typescript
import { createProfileApiClient } from "@profile/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiClient = createProfileApiClient({
 baseURL: "https://api.example.com",
 getToken: () => AsyncStorage.getItem("accessToken"),
 onUnauthorized: () => {
  // Navigate to login screen
  navigationRef.navigate("Login");
 },
});
```

## 📚 API Reference

### Configuration

```typescript
interface HttpClientConfig {
 baseURL: string;
 timeout?: number; // default: 30000
 getToken?: () => string | null | Promise<string | null>;
 refreshToken?: () => Promise<string | null>;
 onUnauthorized?: () => void;
 headers?: Record<string, string>;
}
```

### Available Repositories

| Repository      | Description                  |
| --------------- | ---------------------------- |
| `users`         | User profile management      |
| `resumes`       | Resume CRUD operations       |
| `onboarding`    | Onboarding flow              |
| `themes`        | Theme management             |
| `techSkills`    | Tech skills catalog          |
| `admin`         | Admin dashboard              |
| `auth`          | Authentication               |
| `sectionConfig` | Resume section configuration |

### Users Repository

```typescript
apiClient.users.getMe(); // Get current user
apiClient.users.updateMe(data); // Update profile
apiClient.users.getMyStats(); // Get user stats
apiClient.users.getByUsername(username); // Get public profile
apiClient.users.checkUsername(username); // Check availability
apiClient.users.uploadImage(file); // Upload avatar
```

### Resumes Repository

```typescript
apiClient.resumes.getAll(); // List all resumes
apiClient.resumes.getById(id); // Get resume by ID
apiClient.resumes.getBySlug(slug); // Get public resume
apiClient.resumes.create(data); // Create resume
apiClient.resumes.update(id, data); // Update resume
apiClient.resumes.delete(id); // Delete resume
apiClient.resumes.duplicate(id); // Duplicate resume

// Experience
apiClient.resumes.addExperience(resumeId, data);
apiClient.resumes.updateExperience(resumeId, expId, data);
apiClient.resumes.deleteExperience(resumeId, expId);

// Education
apiClient.resumes.addEducation(resumeId, data);
apiClient.resumes.updateEducation(resumeId, eduId, data);
apiClient.resumes.deleteEducation(resumeId, eduId);

// Skills, Languages, Certifications, Projects...
```

### Themes Repository

```typescript
apiClient.themes.getAll(params?)           // List themes
apiClient.themes.getById(id)               // Get theme
apiClient.themes.getSystem()               // Get system themes
apiClient.themes.getPopular(limit?)        // Get popular themes
apiClient.themes.getMyThemes()             // Get user's themes
apiClient.themes.create(data)              // Create theme
apiClient.themes.update(id, data)          // Update theme
apiClient.themes.delete(id)                // Delete theme
apiClient.themes.fork(themeId, name)       // Fork theme
apiClient.themes.apply(data)               // Apply to resume
```

### Tech Skills Repository

```typescript
apiClient.techSkills.getAreas(); // Get tech areas
apiClient.techSkills.getNiches(); // Get niches
apiClient.techSkills.getNichesByArea(type); // Get niches by area
apiClient.techSkills.getLanguages(); // Get programming langs
apiClient.techSkills.searchLanguages(q); // Search languages
apiClient.techSkills.getSkills(); // Get all skills
apiClient.techSkills.searchSkills(q); // Search skills
apiClient.techSkills.searchAll(q); // Combined search
```

## 🛠️ Development

```bash
# Build the package
pnpm --filter @profile/api-client build

# Watch mode
pnpm --filter @profile/api-client dev

# Type check
pnpm --filter @profile/api-client type-check
```

## 📁 Structure

```
packages/api-client/
├── src/
│   ├── index.ts              # Main exports
│   ├── client/
│   │   ├── http-client.ts    # HTTP client implementation
│   │   └── index.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── resume.repository.ts
│   │   ├── onboarding.repository.ts
│   │   ├── theme.repository.ts
│   │   ├── tech-skills.repository.ts
│   │   ├── admin.repository.ts
│   │   ├── auth.repository.ts
│   │   ├── section-config.repository.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── user.types.ts
│   │   ├── resume.types.ts
│   │   ├── onboarding.types.ts
│   │   ├── theme.types.ts
│   │   ├── tech-skills.types.ts
│   │   ├── admin.types.ts
│   │   ├── auth.types.ts
│   │   ├── common.types.ts
│   │   └── index.ts
│   └── errors/
│       └── index.ts
├── tsconfig.json
├── tsup.config.ts
└── package.json
```

## 🔄 Migration from Internal HTTP Client

If you're migrating from the internal `http-client`:

```typescript
// Before
import { httpClient } from "@/shared/lib/http-client";
const user = await httpClient.get<User>("/users/me");

// After
import { apiClient } from "@/shared/lib/api-client";
const user = await apiClient.users.getMe();
```

## 📝 License

MIT - ProFile Project
