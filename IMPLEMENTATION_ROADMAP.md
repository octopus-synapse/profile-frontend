# Profile Frontend Implementation Roadmap

> **Data:** 14 Jan 2026  
> **Baseado em:** Análise completa de profile-services vs profile-frontend

---

## 📊 Resumo do Gap Analysis

### Backend Controllers (profile-services)

Total: **50+ endpoints** em **30+ controllers**

### Frontend API Client (profile-frontend/packages/api-client)

Total: **24 repositories** implementados

---

## 🔴 CRÍTICO - Features Missing

### 1. Resume Sections Controllers (CRUD completo no backend, parcial no frontend)

O backend tem controllers separados para CADA seção do currículo:

| Seção           | Backend Controller             | Frontend Repository            | Status        |
| --------------- | ------------------------------ | ------------------------------ | ------------- |
| Education       | `education.controller.ts`      | ❌ Inline no resume.repository | **REFATORAR** |
| Experience      | `experience.controller.ts`     | ❌ Inline no resume.repository | **REFATORAR** |
| Skills          | `skill.controller.ts`          | ❌ Inline no resume.repository | **REFATORAR** |
| Languages       | `language.controller.ts`       | ❌ Inline no resume.repository | **REFATORAR** |
| Projects        | `project.controller.ts`        | ❌ Inline no resume.repository | **REFATORAR** |
| Certifications  | `certification.controller.ts`  | ❌ Inline no resume.repository | **REFATORAR** |
| Awards          | `award.controller.ts`          | ❌ Missing                     | **CRIAR**     |
| Publications    | `publication.controller.ts`    | ❌ Missing                     | **CRIAR**     |
| Talks           | `talk.controller.ts`           | ❌ Missing                     | **CRIAR**     |
| Open Source     | `open-source.controller.ts`    | ❌ Missing                     | **CRIAR**     |
| Bug Bounties    | `bug-bounty.controller.ts`     | ❌ Missing                     | **CRIAR**     |
| Hackathons      | `hackathon.controller.ts`      | ❌ Missing                     | **CRIAR**     |
| Interests       | `interest.controller.ts`       | ❌ Missing                     | **CRIAR**     |
| Achievements    | `achievement.controller.ts`    | ❌ Missing                     | **CRIAR**     |
| Recommendations | `recommendation.controller.ts` | ❌ Missing                     | **CRIAR**     |

### 2. Resume Versions (Histórico/Undo)

| Feature         | Backend                                            | Frontend | Status    |
| --------------- | -------------------------------------------------- | -------- | --------- |
| Get versions    | `GET /v1/resumes/:id/versions`                     | ❌       | **CRIAR** |
| Restore version | `POST /v1/resumes/:id/versions/:versionId/restore` | ❌       | **CRIAR** |

### 3. Collaboration System

| Feature             | Backend                                     | Frontend | Status    |
| ------------------- | ------------------------------------------- | -------- | --------- |
| Invite collaborator | `POST /resumes/:id/collaborators`           | ❌       | **CRIAR** |
| List collaborators  | `GET /resumes/:id/collaborators`            | ❌       | **CRIAR** |
| Update role         | `PATCH /resumes/:id/collaborators/:userId`  | ❌       | **CRIAR** |
| Remove collaborator | `DELETE /resumes/:id/collaborators/:userId` | ❌       | **CRIAR** |
| Shared with me      | `GET /resumes/shared-with-me`               | ❌       | **CRIAR** |

### 4. Search System

| Feature         | Backend                   | Frontend | Status    |
| --------------- | ------------------------- | -------- | --------- |
| Search resumes  | `GET /search`             | ❌       | **CRIAR** |
| Autocomplete    | `GET /search/suggestions` | ❌       | **CRIAR** |
| Similar resumes | `GET /search/similar/:id` | ❌       | **CRIAR** |

### 5. MEC Integration (Instituições de Ensino BR)

| Feature             | Backend                    | Frontend | Status    |
| ------------------- | -------------------------- | -------- | --------- |
| Search institutions | `GET /v1/mec/institutions` | ❌       | **CRIAR** |
| Search courses      | `GET /v1/mec/courses`      | ❌       | **CRIAR** |
| Get metadata        | `GET /v1/mec/metadata`     | ❌       | **CRIAR** |

### 6. Upload System

| Feature       | Backend                  | Frontend | Status    |
| ------------- | ------------------------ | -------- | --------- |
| Upload file   | `POST /v1/upload`        | ❌       | **CRIAR** |
| Upload avatar | `POST /v1/upload/avatar` | ❌       | **CRIAR** |

### 7. User Preferences

| Feature            | Backend                          | Frontend | Status    |
| ------------------ | -------------------------------- | -------- | --------- |
| Get preferences    | `GET /v1/users/me/preferences`   | ❌       | **CRIAR** |
| Update preferences | `PATCH /v1/users/me/preferences` | ❌       | **CRIAR** |

---

## 🟡 MÉDIO - Stores Missing

| Store                      | Exists? | Features                          |
| -------------------------- | ------- | --------------------------------- |
| `resume-sections.store.ts` | ❌      | CRUD para cada seção do currículo |
| `search.store.ts`          | ❌      | Busca de currículos públicos      |
| `collaboration.store.ts`   | ❌      | Colaboração em tempo real         |
| `resume-versions.store.ts` | ❌      | Histórico e restore               |
| `upload.store.ts`          | ❌      | Upload de arquivos/avatares       |
| `mec.store.ts`             | ❌      | Instituições/cursos MEC           |

---

## 🟠 MOBILE APP - Status Atual

### Implementado ✅

- [ ] Login screen (básico)
- [ ] Register screen (básico)
- [ ] Resumes list (básico)
- [ ] Profile tab (vazio)
- [ ] Social tab (vazio)
- [ ] Chat tab (vazio)

### Faltando ❌

| Feature                                      | Priority   |
| -------------------------------------------- | ---------- |
| Resume Editor                                | 🔴 CRÍTICO |
| Resume Preview                               | 🔴 CRÍTICO |
| Section Editors (Education, Experience, etc) | 🔴 CRÍTICO |
| Profile Settings                             | 🟡 MÉDIO   |
| Theme Selection                              | 🟡 MÉDIO   |
| Export PDF                                   | 🟡 MÉDIO   |
| Chat real-time                               | 🟢 BAIXO   |
| Social feed                                  | 🟢 BAIXO   |
| Notifications                                | 🟢 BAIXO   |
| Offline mode                                 | 🟢 BAIXO   |

---

## 📋 PLANO DE IMPLEMENTAÇÃO (Priorizado)

### Fase 1: Foundation (Semana 1-2)

1. **Criar repositories faltando no api-client:**
   - `resume-sections.repository.ts` (ou separar por seção)
   - `resume-versions.repository.ts`
   - `collaboration.repository.ts`
   - `search.repository.ts`
   - `upload.repository.ts`
   - `mec.repository.ts`

2. **Criar stores correspondentes**

3. **Atualizar profile-contracts com schemas faltando**

### Fase 2: Web App Features (Semana 3-4)

1. **Resume Editor Completo:**
   - Page: `/protected/resume/[id]/edit`
   - Components para cada seção
   - Drag & drop para reordenar
   - Auto-save

2. **Resume Versions:**
   - Page: `/protected/resume/[id]/history`
   - Timeline de versões
   - Preview antes de restore
   - Diff visual

3. **Collaboration:**
   - Modal para convidar
   - Lista de colaboradores
   - Role management
   - Shared resumes list

4. **Search:**
   - Page: `/search`
   - Filtros avançados
   - Autocomplete
   - Results grid

### Fase 3: Mobile App (Semana 5-6)

1. **Resume Viewer/Editor:**
   - Telas para cada seção
   - Native inputs
   - Offline draft

2. **Settings:**
   - Profile edit
   - Theme selection
   - Notification preferences

3. **Export:**
   - Share sheet integration
   - PDF generation

### Fase 4: Advanced Features (Semana 7-8)

1. **MEC Integration:**
   - Autocomplete de instituições
   - Autocomplete de cursos
   - Integrar no Education section

2. **Upload System:**
   - Avatar upload
   - Document upload
   - Image compression

3. **Chat & Social:**
   - Real-time messaging
   - Activity feed
   - Follow system

---

## 🧪 TESTES NECESSÁRIOS

### Unit Tests

- [ ] Todos os novos repositories
- [ ] Todos os novos stores
- [ ] Novos schemas em profile-contracts

### Integration Tests

- [ ] Resume CRUD flow
- [ ] Collaboration flow
- [ ] Search flow
- [ ] Version history flow

### E2E Tests

- [ ] Resume creation to export
- [ ] Collaboration invite flow
- [ ] Mobile login to resume view

---

## 📁 ESTRUTURA SUGERIDA

```
profile-frontend/
├── packages/
│   ├── api-client/
│   │   └── src/repositories/
│   │       ├── resume-sections/     # NOVO
│   │       │   ├── education.repository.ts
│   │       │   ├── experience.repository.ts
│   │       │   ├── skill.repository.ts
│   │       │   └── ... (cada seção)
│   │       ├── resume-versions.repository.ts  # NOVO
│   │       ├── collaboration.repository.ts    # NOVO
│   │       ├── search.repository.ts           # NOVO
│   │       ├── upload.repository.ts           # NOVO
│   │       └── mec.repository.ts              # NOVO
│   ├── stores/
│   │   └── src/
│   │       ├── resume-sections.store.ts  # NOVO
│   │       ├── resume-versions.store.ts  # NOVO
│   │       ├── collaboration.store.ts    # NOVO
│   │       ├── search.store.ts           # NOVO
│   │       ├── upload.store.ts           # NOVO
│   │       └── mec.store.ts              # NOVO
│   └── features/
│       └── src/
│           ├── resume-editor/      # NOVO - hooks para edição
│           ├── collaboration/      # NOVO
│           └── search/             # NOVO
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── app/[locale]/(app)/protected/
│   │       │   ├── resume/
│   │       │   │   ├── [id]/
│   │       │   │   │   ├── edit/        # NOVO
│   │       │   │   │   ├── history/     # NOVO
│   │       │   │   │   └── collaborate/ # NOVO
│   │       │   │   └── new/             # NOVO
│   │       │   └── shared/              # NOVO
│   │       └── features/
│   │           ├── resume-editor/       # NOVO
│   │           ├── collaboration/       # NOVO
│   │           └── search/              # NOVO
│   └── mobile/
│       └── app/
│           ├── (tabs)/
│           │   ├── resume/
│           │   │   ├── [id].tsx         # NOVO
│           │   │   └── edit/[id].tsx    # NOVO
│           │   └── settings/
│           │       └── index.tsx        # NOVO
│           └── search/
│               └── index.tsx            # NOVO
└── profile-ui/
    └── src/components/
        ├── ResumeEditor/          # NOVO
        ├── SectionEditor/         # NOVO
        ├── CollaboratorList/      # NOVO
        ├── VersionTimeline/       # NOVO
        └── SearchFilters/         # NOVO
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Escolher qual feature começar** (recomendo: Resume Sections)
2. **Criar os types/schemas em profile-contracts**
3. **Criar repository no api-client**
4. **Criar store**
5. **Criar componentes em profile-ui**
6. **Implementar na web**
7. **Portar para mobile**

---

> **Estimativa Total:** 6-8 semanas para feature parity completa  
> **Prioridade #1:** Resume Editor com todas as seções
