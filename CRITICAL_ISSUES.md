# 🚨 Falhas Críticas Encontradas - profile-frontend

**Data:** 2026-01-15  
**Reviewed by:** GitHub Copilot  
**Severity:** 🔴 Critical | 🟡 Warning | 🔵 Info

---

## 🔴 CRÍTICAS (Ação Imediata Necessária)

### 1. **CSRF Token Inseguro em Desenvolvimento**

**Arquivo:** `apps/web/src/shared/lib/csrf.ts:62-68`  
**Problema:**

```typescript
const isSecure = window.location.protocol === "https:";
const cookieOptions = [
 `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
 "Path=/",
 "SameSite=Strict",
 isSecure ? "Secure" : "", // ❌ Em dev (HTTP), cookie não é Secure
];
```

**Impacto:** Em desenvolvimento (HTTP), o CSRF token pode ser interceptado via MitM.  
**Fix:**

```typescript
// Sempre usar Secure mesmo em dev, ou usar HTTPS local
const isSecure = true; // Force Secure sempre
// OU adicionar exceção explícita:
const isDev = process.env.NODE_ENV === "development";
isSecure ? "Secure" : isDev ? "" : "Secure";
```

---

### 2. **Console.log em Produção**

**Arquivos:** Múltiplos (21+ ocorrências)  
**Problema:**

```typescript
// apps/web/src/lib/analytics.ts:55
console.log(
 `%c[Analytics] ${event}`,
 "color: #4f46e5; font-weight: bold;",
 eventData
);

// apps/web/src/features/onboarding/components/steps/review-step.tsx:151
console.log("Submitting onboarding payload:", payload);
```

**Impacto:**

- Vazamento de dados sensíveis (payloads, tokens) no console do browser
- Performance degradada em produção
- Informações úteis para atacantes

**Fix:**

```typescript
// Criar logger condicional
const logger = {
 log: (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
   console.log(...args);
  }
 },
 error: (...args: any[]) => console.error(...args), // Sempre logar erros
 warn: (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
   console.warn(...args);
  }
 },
};
```

---

### 3. **NextAuth Secret Fraco em .env.local**

**Arquivo:** `apps/web/.env.local:7`  
**Problema:**

```bash
NEXTAUTH_SECRET=development-secret-key-min-32-characters-long
```

**Impacto:** Secret previsível em desenvolvimento pode vazar para produção.  
**Fix:**

```bash
# Gerar secret forte:
openssl rand -base64 32

# Em .env.local (dev):
NEXTAUTH_SECRET=<generated-secret>

# Em produção, SEMPRE usar variável de ambiente:
NEXTAUTH_SECRET=<strong-production-secret>

# Adicionar validação em apps/web/src/config/env.ts:
if (process.env.NODE_ENV === 'production' &&
    process.env.NEXTAUTH_SECRET?.includes('development')) {
  throw new Error('NEXTAUTH_SECRET inválido em produção!');
}
```

---

### 4. **Falta Content Security Policy (CSP)**

**Arquivo:** `apps/web/next.config.ts`  
**Problema:** CSP não está configurado, permitindo XSS attacks.

**Fix:** Adicionar header CSP:

```typescript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Ajustar conforme necessário
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' http://localhost:3001", // API
    "frame-ancestors 'none'",
  ].join("; "),
}
```

---

## 🟡 WARNINGS (Ação Recomendada)

### 5. **localStorage sem Criptografia**

**Arquivo:** `apps/web/src/components/landing/ConsentModal.tsx:58`  
**Problema:**

```typescript
localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
```

**Impacto:** Dados sensíveis de consent armazenados em plain text.  
**Recomendação:** Criptografar dados sensíveis antes de armazenar:

```typescript
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY || "fallback-key";

function encrypt(data: any): string {
 return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

function decrypt(encryptedData: string): any {
 const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
 return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

localStorage.setItem(CONSENT_STORAGE_KEY, encrypt(consentData));
```

---

### 6. **Falta Rate Limiting no HTTP Client**

**Arquivo:** `packages/api-client/src/client/http-client.ts`  
**Problema:** Não há rate limiting client-side, permitindo spam de requests.

**Recomendação:** Adicionar throttling/debouncing para requests críticos.

---

### 7. **Middleware sem CSRF Validation**

**Arquivo:** `apps/web/src/middleware.ts`  
**Problema:** Middleware não valida CSRF token em rotas protegidas.

**Recomendação:** Adicionar validação CSRF no middleware para POST/PUT/DELETE.

---

### 8. **Falta Timeout em Requests**

**Arquivo:** `packages/api-client/src/client/http-client.ts:38`  
**Problema:**

```typescript
export interface HttpClientConfig {
 baseURL: string;
 timeout?: number; // ❌ Opcional, pode não ter timeout
}
```

**Fix:**

```typescript
timeout?: number; // Default: 30000 (30s)

// No construtor:
this.instance = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout ?? 30000, // Default 30s
```

---

## 🔵 INFO (Melhorias Recomendadas)

### 9. **Versão de profile-contracts Desatualizada no Mobile**

**Arquivo:** `apps/mobile/package.json:21`

```json
"@octopus-synapse/profile-contracts": "1.4.0"
```

**Atual:** v3.7.0  
**Fix:** Atualizar para `"file:../../../profile-contracts"` ou publicar no registry.

---

### 10. **Falta Error Boundary Global**

**Arquivo:** `apps/web/src/app/global-error.tsx` existe mas não está documentado.

**Recomendação:** Adicionar telemetria de erros (Sentry, etc).

---

## 📊 Resumo de Severidade

| Severidade | Quantidade | Prioridade        |
| ---------- | ---------- | ----------------- |
| 🔴 Crítica | 4          | P0 - Imediato     |
| 🟡 Warning | 4          | P1 - 1-2 dias     |
| 🔵 Info    | 2          | P2 - Sprint atual |

---

## ✅ Action Items

### Imediato (P0):

- [ ] Fix CSRF cookie Secure flag
- [ ] Remover/condicionalizar console.logs
- [ ] Gerar NEXTAUTH_SECRET forte
- [ ] Adicionar CSP header

### Curto Prazo (P1):

- [ ] Implementar criptografia de localStorage
- [ ] Adicionar rate limiting
- [ ] Validar CSRF no middleware
- [ ] Configurar timeout padrão

### Médio Prazo (P2):

- [ ] Atualizar profile-contracts no mobile
- [ ] Adicionar telemetria de erros

---

## 🔒 Security Checklist para Produção

- [ ] HTTPS obrigatório
- [ ] Environment variables validadas
- [ ] Secrets rotacionados
- [ ] CSP configurado
- [ ] CORS restrito ao domínio
- [ ] Rate limiting ativo
- [ ] Logs sanitizados
- [ ] Dependencies auditadas (`npm audit`, `bun audit`)
- [ ] Security headers testados (securityheaders.com)
- [ ] Penetration testing realizado
