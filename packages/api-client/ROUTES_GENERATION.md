# Sistema de Rotas Geradas Automaticamente

## Visão Geral

Todas as rotas da API são agora geradas automaticamente a partir do SDK Orval, que por sua vez é gerado a partir do `swagger.json` do backend (`profile-services`).

**Princípio:** SINGLE SOURCE OF TRUTH = Backend's swagger.json

## Como Funciona

### 1. Geração do SDK
```bash
bun run sdk:generate
```

Este comando executa 3 etapas:
1. **Orval** gera o SDK TypeScript a partir do swagger.json
2. **generate-barrel.ts** cria barrel exports para módulos
3. **generate-routes.ts** extrai URLs e cria `src/constants/routes.ts`

### 2. Arquivo routes.ts Gerado

O arquivo `src/constants/routes.ts` contém:

- **Funções utilitárias:**
  - `getApiBaseUrl()` - URL base da API
  - `getBackendHost()` - Host para testes E2E (sem `/api`)

- **Constantes estáticas:** Para rotas sem parâmetros
  ```typescript
  export const AUTH_ROUTES = {
    AUTH_SIGNUP: "/api/v1/auth/signup",
    AUTH_LOGIN: "/api/v1/auth/login",
    AUTH_GET_CURRENT_USER: "/api/v1/auth/me",
    // ...
  } as const;
  ```

- **Funções com parâmetros:** Re-exportadas do SDK
  ```typescript
  export {
    getUsersGetPublicProfileByUsernameUrl,  // (username: string) => string
    getResumesDeleteResumeUrl,              // (id: string) => string
    // ...
  } from "../generated/api/users/users";
  ```

## Como Usar nos Testes E2E

### Exemplo 1: Rotas Estáticas

```typescript
import { getBackendHost, AUTH_ROUTES } from "../../src/constants/routes";

const BASE_URL = getBackendHost();

// Usar rota estática
const response = await fetch(`${BASE_URL}${AUTH_ROUTES.AUTH_SIGNUP}`, {
  method: "POST",
  body: JSON.stringify({ email, password, name }),
});
```

### Exemplo 2: Rotas com Parâmetros

```typescript
import {
  getBackendHost,
  getUsersGetPublicProfileByUsernameUrl
} from "../../src/constants/routes";

const BASE_URL = getBackendHost();

// Usar função que gera URL dinâmica
const url = getUsersGetPublicProfileByUsernameUrl("johndoe");
const response = await fetch(`${BASE_URL}${url}`, {
  method: "GET",
});
```

### Exemplo 3: Misturando Ambos

```typescript
import {
  getBackendHost,
  AUTH_ROUTES,
  RESUMES_ROUTES,
  getResumesGetResumeDetailsUrl
} from "../../src/constants/routes";

const BASE_URL = getBackendHost();

// 1. Criar usuário (rota estática)
await fetch(`${BASE_URL}${AUTH_ROUTES.AUTH_SIGNUP}`, { ... });

// 2. Criar resumo (rota estática)
const resumeResponse = await fetch(`${BASE_URL}${RESUMES_ROUTES.RESUMES_CREATE_RESUME_FOR_USER}`, { ... });
const { id: resumeId } = await resumeResponse.json();

// 3. Buscar resumo por ID (rota dinâmica)
await fetch(`${BASE_URL}${getResumesGetResumeDetailsUrl(resumeId)}`, { ... });
```

## Arquivos Atualizados

✅ **auth.e2e.test.ts** - Usa `AUTH_ROUTES`
✅ **onboarding.e2e.test.ts** - Usa `ONBOARDING_ROUTES`
✅ **platform.e2e.test.ts** - Usa `PLATFORM_ROUTES`
✅ **users.e2e.test.ts** - Usa `USERS_ROUTES` + funções dinâmicas

## Arquivos Pendentes

Os seguintes arquivos ainda usam URLs hardcoded e devem ser atualizados:

- [ ] **export.e2e.test.ts**
- [ ] **github.e2e.test.ts**
- [ ] **resume-config.e2e.test.ts**
- [ ] **resumes.e2e.test.ts**
- [ ] **skills-catalog.e2e.test.ts**
- [ ] **themes.e2e.test.ts**

### Template de Atualização

```typescript
// ANTES
const API_URL = "http://localhost:3001/api";
const response = await fetch(`${API_URL}/auth/signup`, { ... });

// DEPOIS
import { getBackendHost, AUTH_ROUTES } from "../../src/constants/routes";
const BASE_URL = getBackendHost();
const response = await fetch(`${BASE_URL}${AUTH_ROUTES.AUTH_SIGNUP}`, { ... });
```

## Descobrindo Rotas Disponíveis

### Método 1: Explorar routes.ts
Abra `src/constants/routes.ts` e procure pela categoria desejada (AUTH_ROUTES, RESUMES_ROUTES, etc.)

### Método 2: Grep no SDK gerado
```bash
grep "export const get.*Url" src/generated/api/resumes/resumes.ts
```

### Método 3: TypeScript IntelliSense
Ao importar de `routes.ts`, o auto-complete mostrará todas as constantes e funções disponíveis.

## Manutenção

### Quando Regenerar?

Execute `bun run sdk:generate` quando:
1. O swagger.json do backend for atualizado
2. Novas rotas forem adicionadas ao backend
3. Rotas existentes forem modificadas

### Verificação

Após regenerar, verifique:
```bash
# Ver estatísticas
bun run sdk:generate
# Output: ✓ Generated routes file with 60 static routes and 149 URL functions across 19 categories

# Testar testes E2E
bun test __tests__/e2e/
```

## Benefícios

1. **Type Safety:** Erros de rota detectados em tempo de compilação
2. **DRY:** URLs definidos uma única vez
3. **Manutenibilidade:** Mudanças no backend refletidas automaticamente
4. **Documentação:** routes.ts serve como documentação viva da API
5. **Refatoração segura:** Renomear rotas é trivial com find & replace

## Troubleshooting

### Rota não aparece em routes.ts

1. Verifique se a rota existe no swagger.json
2. Regenere o SDK: `bun run sdk:generate`
3. Verifique o script `scripts/generate-routes.ts`

### Erro de importação

Certifique-se de importar do caminho correto:
```typescript
// Correto
import { AUTH_ROUTES } from "../../src/constants/routes";

// Incorreto
import { AUTH_ROUTES } from "@profile/api-client";  // barrel export não inclui routes
```

### URL com parâmetro não existe

Algumas rotas podem ter sido geradas como constantes estáticas em vez de funções. Verifique:
```typescript
// Se esperava função mas é constante, construa manualmente:
const resumeId = "123";
const url = `/api/v1/resumes/${resumeId}`;  // Último recurso
```
