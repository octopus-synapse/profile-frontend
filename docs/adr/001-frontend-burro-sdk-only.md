# ADR 001: Frontend Burro - SDK Only

**Status**: Aceito
**Data**: 2026-03-28
**Deciders**: Equipe Profile
**Contexto**: Arquitetura Frontend

---

## Contexto

O projeto `profile-frontend` cresceu organicamente, resultando em múltiplas camadas de abstração que duplicam funcionalidade já provida pelo SDK gerado via Orval:

- **Hooks locais** que "embrulham" hooks do SDK
- **Services/Repositories** que replicam chamadas HTTP do SDK
- **Types locais** que duplicam modelos gerados

Esta abordagem viola o princípio DRY e cria manutenção desnecessária. Quando o backend muda, precisamos atualizar em dois lugares.

---

## Decisão

**Adotamos o padrão "Frontend Burro"**: O frontend é uma camada de apresentação fina que consome diretamente o SDK gerado (`@profile/api-client`).

### Regras

#### O que é PERMITIDO no Frontend

| Item | Descrição |
|------|-----------|
| Hooks SDK | Usar diretamente `useResumesGetAllUserResumes()`, `useUsersGetProfile()`, etc. |
| Models SDK | Importar tipos de `@profile/api-client` (ex: `ResumeDto`, `UserDto`) |
| Hooks UI | `useState`, `useReducer`, `useRef` para estado local de UI |
| Hooks Genéricos | `useLocalStorage`, `useMediaQuery`, `useDebounce` (em `shared/hooks/`) |
| WebSocket Hooks | Hooks específicos para WebSocket são legítimos (real-time) |
| Context Providers | Para estado global de UI (theme, toast, modal) |

#### O que é PROIBIDO no Frontend

| Item | Motivo |
|------|--------|
| `/hooks` em domínios | Não criar `components/{domain}/hooks/` |
| Services locais | Não criar `{domain}/services/` ou `{domain}/repository.ts` |
| Types locais | Não criar `{domain}/types/index.ts` duplicando SDK |
| Validation local | Backend valida; frontend exibe erros |
| Custom fetch | Usar hooks gerados, não `fetch` manual |
| Re-exports de SDK | Não criar barrels que re-exportam hooks SDK |

### Padrão de Uso

```typescript
// CORRETO: Usar SDK diretamente no componente
import { useUsersGetProfile, useUsersUpdateProfile } from '@profile/api-client';
import type { UpdateUserDto } from '@profile/api-client';

function ProfileForm() {
  const { data, isLoading } = useUsersGetProfile();
  const mutation = useUsersUpdateProfile();

  const handleSubmit = (formData: UpdateUserDto) => {
    mutation.mutate({ data: formData });
  };

  // ...
}
```

```typescript
// ERRADO: Criar camada intermediária
// components/users/hooks/use-user-profile.ts
import { useUsersGetProfile } from '@profile/api-client';

export function useUserProfile() {
  return useUsersGetProfile(); // <- Camada inútil
}
```

---

## Arquivos a Deletar

Esta decisão implica na remoção dos seguintes arquivos:

### Users Domain (~400 linhas)
```
components/users/hooks/use-user-queries.ts
components/users/hooks/use-user-mutations.ts
components/users/services/user-repository.ts
components/users/types/index.ts
```

### Admin Domain (~350 linhas)
```
components/admin/hooks/use-admin-queries.ts
components/admin/hooks/use-section-type-management.ts
components/admin/services/admin-repository.ts
components/admin/types/index.ts
components/admin/types/section-types.ts
components/admin/types/field-definition.ts
```

### Tech-Skills Domain (~360 linhas)
```
components/tech-skills/hooks/use-tech-skills.ts
components/tech-skills/services/tech-skills-repository.ts
components/tech-skills/types/index.ts
```

### Chat Domain (~250 linhas parciais)
```
components/chat/hooks/use-chat.ts (parcial - manter WebSocket)
components/chat/hooks/use-chat-block.ts
```

**Total estimado**: ~1.200 linhas de código duplicado

---

## Exceções Legítimas

### 1. WebSocket/Real-time

Hooks para WebSocket são legítimos pois lidam com conexões persistentes:

```typescript
// LEGÍTIMO: WebSocket não é coberto pelo SDK REST
components/chat/hooks/use-typing.ts        // Indicador de digitação
components/chat/hooks/use-online-status.ts // Status online
components/chat/hooks/use-socket-events.ts // Eventos em tempo real
```

### 2. UI State Hooks

Hooks que gerenciam estado puramente local de UI:

```typescript
// LEGÍTIMO: Estado de UI, não dados do servidor
shared/hooks/use-local-storage.ts
shared/hooks/use-media-query.ts
shared/hooks/use-debounce.ts
shared/hooks/use-toast.ts
```

### 3. Composição de Múltiplos Hooks SDK

Quando um componente precisa combinar dados de múltiplos endpoints:

```typescript
// LEGÍTIMO: Composição complexa que melhora legibilidade
// MAS: Deve ficar no próprio componente ou em shared/hooks/, não em {domain}/hooks/
function useProfileDashboard() {
  const profile = useUsersGetProfile();
  const resumes = useResumesGetAllUserResumes();
  const stats = useAnalyticsGetDashboard();

  return {
    profile: profile.data,
    resumes: resumes.data,
    stats: stats.data,
    isLoading: profile.isLoading || resumes.isLoading || stats.isLoading,
  };
}
```

---

## Processo de Migração

### Fase 1: Identificar
1. Listar todos os arquivos em `{domain}/hooks/`, `{domain}/services/`, `{domain}/types/`
2. Verificar se duplicam funcionalidade SDK
3. Marcar para deleção ou refatoração

### Fase 2: Migrar Componentes
1. Encontrar componentes que usam os hooks/services legados
2. Substituir por imports diretos do SDK
3. Ajustar tipos para usar modelos do SDK

### Fase 3: Deletar
1. Remover arquivos marcados
2. Executar `bun run typecheck`
3. Corrigir erros de compilação

### Fase 4: Validar
1. Executar testes E2E
2. Testar manualmente flows críticos

---

## Consequências

### Positivas

- **Menos código** (~1.200 linhas removidas)
- **Menos manutenção** (mudanças no backend refletem automaticamente via SDK)
- **Tipagem consistente** (tipos sempre vêm do OpenAPI)
- **Onboarding mais fácil** (menos abstrações para aprender)
- **Debugging mais simples** (menos camadas para investigar)

### Negativas

- **Componentes mais acoplados ao SDK** (aceitável - SDK é estável)
- **Menos "flexibilidade"** (intencionalmente - evita over-engineering)

---

## Relacionados

- [CLAUDE.md - Seção "Core Architecture: Backend-First"](../../CLAUDE.md)
- [Orval Config](../../packages/api-client/orval.config.ts)
- [SDK Generated Hooks](../../packages/api-client/src/generated/)

---

## Referências

- [You Might Not Need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)
- [TanStack Query - Thinking in React Query](https://tanstack.com/query/latest/docs/framework/react/guides/thinking-in-react-query)
- [The Pragmatic Programmer - DRY Principle](https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/)
