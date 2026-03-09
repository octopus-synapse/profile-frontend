# Profile Services - Análise Técnica Detalhada

Este documento contém a análise completa do backend `profile-services`, estrutura do projeto, arquitetura, e como consumir a API no frontend.

---

## 1. Visão Geral do Projeto

**Profile Services** é um backend construído com **NestJS** usando arquitetura de **Bounded Contexts** (DDD). O projeto gerencia currículos, usuários, temas, colaboração, analytics e integrações.

### Stack Tecnológico

| Tecnologia     | Versão/Descrição                  |
| -------------- | --------------------------------- |
| Framework      | NestJS 11                         |
| Runtime        | Bun                               |
| Banco de dados | PostgreSQL 16                     |
| ORM            | Prisma 7.4                        |
| Cache          | Redis 7 (ioredis)                 |
| API            | REST + GraphQL (Apollo Server)    |
| Autenticação   | JWT + OAuth (NextAuth compatible) |
| Fila           | BullMQ                            |
| Storage        | MinIO (S3-compatible)             |
| Email          | SendGrid                          |
| Tradução       | LibreTranslate                    |
| Docs           | Swagger/OpenAPI                   |

### Porta Padrão

- **Backend**: `3001`
- **Swagger UI**: `http://localhost:3001/api/docs`
- **GraphQL Playground**: `http://localhost:3001/graphql`

---

## 2. Arquitetura do Projeto

### Estrutura de Diretórios

```
src/
├── main.ts                    # Bootstrap da aplicação
├── app.module.ts              # Módulo raiz
├── app.controller.ts          # Controller raiz
├── app.service.ts
├── bounded-contexts/          # Domínios separados (DDD)
│   ├── analytics/             # Analytics, Search, Share Analytics
│   ├── ats-validation/        # Validação ATS de currículos
│   ├── collaboration/         # Chat, Colaboração em currículos
│   ├── dsl/                   # DSL para renderização de currículos
│   ├── export/                # Exportação (PDF, DOCX, LaTeX, JSON)
│   ├── identity/              # Auth, Users, 2FA, Password Management
│   ├── import/                # Import de currículos (JSON Resume)
│   ├── integration/           # GitHub, Upload, MEC Sync
│   ├── onboarding/            # Fluxo de onboarding
│   ├── platform/              # Health, Metrics, Logging, Prisma, GraphQL
│   ├── presentation/          # Themes, Public Resumes
│   ├── resumes/               # CRUD de currículos, seções, versões
│   ├── skills-catalog/        # Tech Skills, Spoken Languages
│   ├── social/                # Activity Feed, Follows
│   └── translation/           # Tradução de textos
├── shared-kernel/             # Código compartilhado
│   ├── constants/             # Constantes globais
│   ├── dtos/                  # DTOs SDK response
│   ├── enums/                 # Enums de domínio
│   ├── schemas/               # Zod schemas
│   ├── types/                 # TypeScript types
│   ├── validations/           # Validadores
│   ├── ast/                   # Resume AST schemas
│   └── dsl/                   # Resume DSL schemas
└── graphql/
    └── schema.graphql         # Schema GraphQL gerado (Code-First)
```

---

## 3. Bounded Contexts

### 3.1 Identity (Autenticação e Usuários)

**Localização:** `src/bounded-contexts/identity/`

| Módulo                 | Responsabilidade                           |
| ---------------------- | ------------------------------------------ |
| `authentication/`      | Login, Logout, Refresh Token               |
| `authorization/`       | RBAC dinâmico (roles, permissions, groups) |
| `users/`               | Perfil, preferências, username             |
| `two-factor-auth/`     | 2FA (TOTP + backup codes)                  |
| `password-management/` | Forgot/Reset/Change password               |
| `email-verification/`  | Verificação de email                       |
| `account-lifecycle/`   | GDPR (export, delete account)              |

**Endpoints principais:**

- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/v1/users/profile` - Perfil autenticado
- `PATCH /api/v1/users/profile` - Atualizar perfil
- `GET /api/v1/users/preferences` - Preferências
- `PATCH /api/v1/users/username` - Atualizar username

### 3.2 Resumes (Currículos)

**Localização:** `src/bounded-contexts/resumes/`

| Módulo             | Responsabilidade   |
| ------------------ | ------------------ |
| `resumes/`         | CRUD de currículos |
| `resume-versions/` | Versionamento      |
| `resume-sections/` | Seções dinâmicas   |

**Endpoints principais:**

- `GET /api/v1/resumes` - Listar currículos do usuário
- `POST /api/v1/resumes` - Criar currículo
- `GET /api/v1/resumes/:id` - Obter currículo
- `GET /api/v1/resumes/:id/full` - Currículo com todas as seções
- `PATCH /api/v1/resumes/:id` - Atualizar currículo
- `DELETE /api/v1/resumes/:id` - Deletar currículo
- `GET /api/v1/resumes/slots` - Slots disponíveis
- `GET /api/v1/resumes/:resumeId/sections` - Listar seções
- `POST /api/v1/resumes/:resumeId/sections/:sectionTypeKey/items` - Criar item
- `PATCH /api/v1/resumes/:resumeId/sections/:sectionTypeKey/items/:itemId` - Atualizar item
- `DELETE /api/v1/resumes/:resumeId/sections/:sectionTypeKey/items/:itemId` - Deletar item

### 3.3 Presentation (Temas)

**Localização:** `src/bounded-contexts/presentation/`

| Módulo            | Responsabilidade               |
| ----------------- | ------------------------------ |
| `themes/`         | CRUD de temas, aprovação, fork |
| `public-resumes/` | Visualização pública por slug  |

**Endpoints principais:**

- `GET /api/v1/themes` - Listar temas publicados
- `GET /api/v1/themes/system` - Temas do sistema
- `GET /api/v1/themes/popular` - Temas populares
- `POST /api/v1/themes` - Criar tema
- `POST /api/v1/themes/apply` - Aplicar tema ao currículo
- `POST /api/v1/themes/fork` - Fork de tema
- `GET /api/v1/public/resumes/:slug` - Currículo público

### 3.4 Export

**Localização:** `src/bounded-contexts/export/`

**Endpoints principais:**

- `GET /api/v1/export/resume/pdf` - Exportar PDF
- `GET /api/v1/export/resume/docx` - Exportar DOCX
- `GET /api/v1/export/:resumeId/json` - Exportar JSON
- `GET /api/v1/export/:resumeId/latex` - Exportar LaTeX
- `GET /api/v1/export/banner` - LinkedIn banner

### 3.5 Onboarding

**Localização:** `src/bounded-contexts/onboarding/`

**Endpoints principais:**

- `GET /api/v1/onboarding/status` - Status do onboarding
- `GET /api/v1/onboarding/progress` - Progresso salvo (checkpoint)
- `PUT /api/v1/onboarding/progress` - Salvar progresso
- `POST /api/v1/onboarding` - Completar onboarding

### 3.6 Analytics

**Localização:** `src/bounded-contexts/analytics/`

| Módulo              | Responsabilidade               |
| ------------------- | ------------------------------ |
| `resume-analytics/` | ATS score, views, benchmark    |
| `search/`           | Busca de currículos públicos   |
| `share-analytics/`  | Analytics de compartilhamentos |

**Endpoints principais:**

- `GET /api/resume-analytics/:resumeId/ats-score` - Score ATS
- `GET /api/resume-analytics/:resumeId/dashboard` - Dashboard completo
- `GET /api/resume-analytics/:resumeId/views` - Estatísticas de views
- `POST /api/resume-analytics/:resumeId/match-job` - Match com vaga
- `GET /api/search` - Buscar currículos públicos

### 3.7 Collaboration

**Localização:** `src/bounded-contexts/collaboration/`

| Módulo           | Responsabilidade            |
| ---------------- | --------------------------- |
| `chat/`          | Mensagens entre usuários    |
| `collaboration/` | Colaboradores em currículos |

**Endpoints principais:**

- `GET /api/chat/conversations` - Listar conversas
- `POST /api/chat/messages` - Enviar mensagem
- `GET /api/resumes/:resumeId/collaborators` - Listar colaboradores
- `POST /api/resumes/:resumeId/collaborators` - Convidar colaborador

### 3.8 Social

**Localização:** `src/bounded-contexts/social/`

**Endpoints principais:**

- `GET /api/v1/feed/subscribe` - SSE stream do feed
- Activity Feed (follows, activities)

### 3.9 Integration

**Localização:** `src/bounded-contexts/integration/`

| Módulo      | Responsabilidade                          |
| ----------- | ----------------------------------------- |
| `github/`   | Sync de dados GitHub                      |
| `upload/`   | Upload de arquivos (MinIO)                |
| `mec-sync/` | Sync dados MEC (instituições brasileiras) |

**Endpoints principais:**

- `POST /api/v1/integrations/github/sync` - Sync GitHub
- `GET /api/v1/integrations/github/summary/:username` - Summary GitHub
- `POST /api/v1/upload/profile-image` - Upload foto perfil
- `POST /api/v1/upload/company-logo/:resumeId` - Upload logo empresa

### 3.10 Skills Catalog

**Localização:** `src/bounded-contexts/skills-catalog/`

**Endpoints principais:**

- `GET /api/v1/tech-skills` - Todas as skills
- `GET /api/v1/tech-areas` - Áreas de tecnologia
- `GET /api/v1/tech-niches` - Nichos
- `GET /api/v1/spoken-languages` - Idiomas

### 3.11 Translation

**Localização:** `src/bounded-contexts/translation/`

**Endpoints principais:**

- `POST /api/v1/translation/text` - Traduzir texto
- `POST /api/v1/translation/batch` - Traduzir batch
- `POST /api/v1/translation/pt-to-en` - PT → EN
- `POST /api/v1/translation/en-to-pt` - EN → PT

---

## 4. Schema do Banco de Dados (Prisma)

O schema está dividido em múltiplos arquivos em `prisma/schema/`:

### Principais Models

#### User

```prisma
model User {
  id                     String    @id @default(cuid())
  email                  String?   @unique
  passwordHash           String?
  username               String?   @unique
  displayName            String?
  hasCompletedOnboarding Boolean   @default(false)
  primaryResumeId        String?
  // Relations: resumes, preferences, auditLogs, consents, etc.
}
```

#### Resume

```prisma
model Resume {
  id             String          @id @default(cuid())
  userId         String
  title          String?
  template       ResumeTemplate  @default(PROFESSIONAL)
  language       String          @default("pt-br")
  isPublic       Boolean         @default(false)
  slug           String?         @unique
  fullName       String?
  jobTitle       String?
  techPersona    String?
  primaryStack   String[]
  activeThemeId  String?
  // Relations: sections, shares, versions, analytics
}
```

#### ResumeSection / SectionType / SectionItem

```prisma
model SectionType {
  id           String  @id @default(cuid())
  key          String  @unique  // e.g., "work-experience", "education"
  semanticKind String            // Categoria semântica
  definition   Json              // JSON Schema para validação
}

model ResumeSection {
  id            String      @id @default(cuid())
  resumeId      String
  sectionTypeId String
  order         Int         @default(0)
  isVisible     Boolean     @default(true)
}

model SectionItem {
  id              String @id @default(cuid())
  resumeSectionId String
  content         Json   // Conteúdo dinâmico conforme definition
  order           Int    @default(0)
}
```

#### ResumeTheme

```prisma
model ResumeTheme {
  id           String        @id @default(cuid())
  name         String
  authorId     String
  category     ThemeCategory @default(MODERN)
  styleConfig  Json
  status       ThemeStatus   @default(PRIVATE)
  isSystemTheme Boolean      @default(false)
}
```

### Enums Importantes

```prisma
enum ThemeStatus {
  DRAFT, PRIVATE, PENDING_APPROVAL, PUBLISHED, REJECTED
}

enum ThemeCategory {
  PROFESSIONAL, CREATIVE, TECHNICAL, ACADEMIC,
  MINIMAL, MODERN, CLASSIC, EXECUTIVE
}

enum ResumeTemplate {
  PROFESSIONAL, CREATIVE, TECHNICAL, MINIMAL,
  MODERN, EXECUTIVE, ACADEMIC
}

enum AuditAction {
  USERNAME_CHANGED, PROFILE_UPDATED, RESUME_CREATED,
  RESUME_UPDATED, RESUME_DELETED, USER_LOGIN, USER_LOGOUT, ...
}

enum ConsentDocumentType {
  TERMS_OF_SERVICE, PRIVACY_POLICY, MARKETING_CONSENT
}
```

---

## 5. Autenticação

### JWT Authentication

- **Método**: Bearer Token
- **Header**: `Authorization: Bearer <access_token>`
- **Expiração padrão**: 7 dias (configurável via `JWT_EXPIRATION`)

### Fluxo de Login

```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhb...",
    "refreshToken": "eyJhb...",
    "expiresIn": 604800,
    "userId": "cuid..."
  }
}
```

### Refresh Token

```
POST /api/auth/refresh
{
  "refreshToken": "eyJhb..."
}
```

### Two-Factor Authentication (2FA)

- `POST /api/auth/2fa/enable` - Habilitar 2FA
- `POST /api/auth/2fa/verify` - Verificar código
- `DELETE /api/auth/2fa` - Desabilitar 2FA

---

## 6. API Response Format

Todas as respostas seguem o padrão:

```typescript
interface DataResponse<T> {
 success: boolean;
 data: T;
}

interface ErrorResponse {
 success: false;
 error: {
  message: string;
  code?: string;
  details?: unknown;
 };
}
```

---

## 7. Como Consumir no Frontend

### SDK Gerado (Orval)

O `profile-frontend` já possui um pacote `@profile/api-client` que gera SDK automaticamente do `swagger.json`:

```typescript
// packages/api-client/orval.config.ts
export default defineConfig({
 "profile-api": {
  input: {
   target: localSwaggerPath, // ../profile-services/swagger.json
  },
  output: {
   mode: "tags-split",
   target: "./src/generated/api/endpoints.ts",
   schemas: "./src/generated/models",
   client: "react-query",
   httpClient: "fetch",
  },
 },
});
```

### Uso no Frontend

```typescript
// Importar hooks gerados
import {
 useResumesGetAllUserResumes,
 useResumesCreateResumeForUser,
 useUsersGetProfile,
} from "@profile/api-client";

// Usar em componentes
function MyComponent() {
 const { data: resumes, isLoading } = useResumesGetAllUserResumes();
 const createResume = useResumesCreateResumeForUser();

 const handleCreate = async () => {
  await createResume.mutateAsync({
   data: { title: "Meu Currículo" },
  });
 };
}
```

### Autenticação no Client

```typescript
import { setAuthToken, clearAuthToken } from "@profile/api-client";

// Após login
setAuthToken(accessToken);

// Logout
clearAuthToken();
```

### Gerar SDK

```bash
cd packages/api-client
bun run sdk:generate
```

---

## 8. Variáveis de Ambiente

### Desenvolvimento Local

```env
# Backend URL
BACKEND_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/profile_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# Storage (MinIO)
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=profile-uploads
```

---

## 9. Docker Setup

### Desenvolvimento

```bash
# Subir containers (postgres, redis, backend)
make dev

# Ou com rebuild
make dev-build

# Ver logs
make dev-logs

# Parar
make dev-down
```

### Containers

| Container            | Porta | Descrição      |
| -------------------- | ----- | -------------- |
| profile-postgres-dev | 5432  | PostgreSQL     |
| profile-redis-dev    | 6379  | Redis          |
| profile-backend-dev  | 3001  | NestJS Backend |
| libretranslate       | 5000  | Tradução       |

---

## 10. GraphQL

O backend também expõe uma API GraphQL para queries específicas:

- **Endpoint**: `GET/POST /graphql`
- **Playground**: `http://localhost:3001/graphql` (só em dev)
- **Schema**: Code-First (gerado automaticamente)

Exemplo:

```graphql
query GetResume($id: String!) {
 resume(id: $id) {
  id
  title
  fullName
  sections {
   id
   sectionType {
    key
   }
   items {
    content
   }
  }
 }
}
```

---

## 11. Endpoints por Tag (Resumo)

### Públicos (sem auth)

- `GET /api/health` - Health check
- `GET /api/v1/public/resumes/:slug` - Currículo público
- `GET /api/search` - Busca pública
- `GET /api/v1/users/:username/profile` - Perfil público
- `GET /api/v1/tech-skills` - Catálogo skills
- `GET /api/v1/tech-areas` - Áreas tech
- `GET /api/v1/mec/*` - Dados MEC

### Autenticados (JWT required)

- Todos os demais endpoints requerem `Authorization: Bearer <token>`

---

## 12. Rate Limiting

- **Limite padrão**: 100 requests por TTL
- **Auth endpoints**: 5 requests (mais restritivo)
- Headers retornados: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## 13. Features Notáveis

### GDPR Compliance

- Export de dados: `GET /api/gdpr/export`
- Deleção de conta com audit trail
- Consent tracking (ToS, Privacy Policy)

### ATS Validation

- Score de compatibilidade ATS
- Sugestões de melhoria
- Match com job descriptions

### DSL para Currículos

- Compilação para AST
- Múltiplos targets de renderização
- Preview sem persistência

### Sistema de Temas

- Temas de sistema e de usuário
- Workflow de aprovação
- Fork de temas
- Customizações por currículo

---

## 14. Fluxo de Desenvolvimento Frontend

1. **Backend rodando**: `make dev` ou `bun run start:dev`
2. **Gerar SDK**: `cd packages/api-client && bun run sdk:generate`
3. **Usar hooks**: Importar de `@profile/api-client`
4. **Auth**: `setAuthToken()` após login

### Exemplo Completo

```typescript
// Login
const login = useAuthLogin();
const { mutateAsync } = login;

const handleLogin = async (email: string, password: string) => {
 const result = await mutateAsync({
  data: { email, password },
 });

 setAuthToken(result.data.accessToken);
 // Salvar refreshToken em storage seguro
};

// Após autenticado - buscar currículos
const { data: resumes } = useResumesGetAllUserResumes();

// Criar currículo
const createResume = useResumesCreateResumeForUser();
await createResume.mutateAsync({
 data: {
  title: "Software Engineer Resume",
  language: "en",
 },
});
```

---

## 15. Próximos Passos para o Frontend

1. **Remover código mobile** (conforme solicitado)
2. **Simplificar estrutura** sem DRY prematuro
3. **Implementar auth flow** com stores
4. **Integrar onboarding** com backend
5. **Criar páginas de currículos** usando SDK

---

_Documento gerado em: 9 de Março de 2026_
_Versão do profile-services: 0.0.27_
