# Bugs Encontrados pelos Testes

## 🐛 Bugs Críticos Encontrados

### 1. `goToNextStep` não avança o step
**Arquivo**: `src/features/onboarding/stores/onboarding-store.ts`
**Teste**: `onboarding-store.test.ts` - "moves to next step and marks current as complete"

**Problema**: 
- `goToNextStep()` não está avançando para o próximo step
- O step permanece em "welcome" quando deveria ir para "personal-info"

**Evidência**:
```
Expected: "personal-info"
Received: "welcome"
```

**Impacto**: Usuário não consegue avançar no onboarding

---

### 2. `buildSubmissionPayload` acessa propriedade incorreta
**Arquivo**: `src/features/onboarding/stores/onboarding-store.ts:447`
**Teste**: `onboarding-store.test.ts` - "builds valid payload when all required fields are present"

**Problema**:
- Código tenta acessar `state.templateSelection.template.toUpperCase()`
- Mas o objeto tem `palette`, não `template`
- Causa `TypeError: undefined is not an object`

**Evidência**:
```typescript
templateSelection: {
  template: state.templateSelection.template.toUpperCase(), // ❌ template não existe
  // Deveria ser:
  // palette: state.templateSelection.palette,
}
```

**Impacto**: Submissão do onboarding falha com erro

---

### 3. `getProgress` não retorna 100% para review step
**Arquivo**: `src/features/onboarding/stores/onboarding-store.ts`
**Teste**: `onboarding-store.test.ts` - "returns 100% for review step"

**Problema**:
- `getProgress()` não retorna 100% quando está no step "review"
- Provavelmente está calculando baseado no índice, mas "review" não é o último step

**Impacto**: Barra de progresso mostra valor incorreto

---

## 📝 Notas

Estes bugs foram encontrados pelos testes comportamentais que seguem os princípios de Kent Beck e Uncle Bob. Os testes testam comportamento, não implementação, e por isso conseguiram encontrar bugs reais no código.

