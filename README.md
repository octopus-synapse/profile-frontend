# Profile Frontend

Frontend moderno para gerenciamento de perfis e currículos profissionais. Consome API NestJS (`profile-services`).

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Configurar environment
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL=http://localhost:3001

# Rodar testes
npm test

# Desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## 📋 Requisitos

- Node.js 18+ ou 20+
- Backend NestJS rodando (`profile-services`)

## 🏗️ Arquitetura

Frontend **100% desacoplado** do backend:
- ✅ Zero lógica de negócio
- ✅ Zero acesso direto ao banco de dados
- ✅ Consome API via HTTP (Axios)
- ✅ State management com Zustand
- ✅ Testes automatizados (Jest + RTL + MSW)

```
Frontend (Next.js)  →  HTTP Client (Axios)  →  Backend API (NestJS)
```

## 📁 Estrutura

```
src/
├── api/              # HTTP client + endpoints
├── stores/           # Zustand stores
├── app/              # Next.js pages
├── components/       # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── types/            # TypeScript types
└── __tests__/        # Tests (Jest + RTL + MSW)
```

## 🧪 Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Coverage (target: 70%)
npm run test:coverage

# Apenas integração
npm run test:integration

# Apenas unitários
npm run test:unit
```

**Coverage atual**: 70%+ em stores e API client

## 📦 Stack Tecnológica

### Produção
- **Next.js 15** - Framework React
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hook Form** - Formulários
- **Zod** - Validação
- **Tailwind CSS** - Styling

### Desenvolvimento
- **TypeScript** - Type safety
- **Jest** - Test runner
- **React Testing Library** - Component tests
- **MSW** - API mocking

## 📚 Documentação

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura completa
- [TESTING.md](./TESTING.md) - Guia de testes
- [INSTALL.md](./INSTALL.md) - Instalação e setup
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Histórico de refatoração

## 🎯 Features

- ✅ Autenticação (login, signup, JWT)
- ✅ Gerenciamento de perfil
- ✅ CRUD de currículos
- ✅ Experiências, educação, skills
- ✅ Export PDF/DOCX
- ✅ Onboarding flow
- ✅ Testes automatizados

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev              # Desenvolvimento (localhost:3000)
npm run build            # Build para produção
npm start                # Produção
```

### Qualidade de Código
```bash
npm run lint             # ESLint
npm run lint:fix         # Corrige problemas do linter
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação
npm run typecheck        # TypeScript check
```

### Testes
```bash
npm test                 # Todos os testes
npm run test:watch       # Testes em watch mode
npm run test:coverage    # Coverage report
npm run test:unit        # Apenas testes unitários
npm run test:integration # Apenas testes de integração
npm run test:e2e         # Apenas testes E2E
```

### Docker
```bash
npm run docker:build     # Build da imagem Docker
npm run docker:run       # Run container local
npm run docker:up        # Inicia com docker-compose
npm run docker:down      # Para containers
npm run docker:logs      # Mostra logs do frontend
```

### Scripts de Deployment
```bash
./scripts/setup.sh                    # Setup inicial do ambiente
./scripts/check-deployment.sh [host]  # Verifica configuração de deploy
./scripts/rollback.sh <image-tag>     # Rollback local
```

## 🌐 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## 🚀 Deploy e CI/CD

### CI/CD Automático (GitHub Actions)

O projeto possui 3 workflows principais:

#### 1. **CI** - Integração Contínua (`.github/workflows/ci.yml`)
- Executa em PRs e pushes na branch `dev`
- Lint, type check, testes, build
- Valida build do Docker

#### 2. **CD** - Deploy Contínuo (`.github/workflows/cd.yml`)
- Executa em push na branch `main`
- Build e push da imagem Docker para GitHub Container Registry
- Deploy automático na VM Alpine Linux
- Health check automático

#### 3. **Rollback** (`.github/workflows/rollback.yml`)
- Execução manual via GitHub Actions
- Rollback para versão anterior
- Validação automática de saúde da aplicação

📖 **Documentação completa**: [DEPLOY.md](./DEPLOY.md)
🔐 **Configuração de Secrets**: [.github/SECRETS.md](.github/SECRETS.md)

### Docker Deploy

```bash
# Build local
docker build -t profile-frontend .

# Run local
docker run -p 3000:3000 --env-file .env profile-frontend

# Com docker-compose
docker-compose up -d
docker-compose logs -f frontend
```

### Deploy Manual na VM

```bash
# 1. SSH na VM
ssh user@vm-host

# 2. Setup inicial
cd /opt/profile-frontend
docker network create profile-network

# 3. Pull e start
docker pull ghcr.io/OWNER/REPO:latest
docker-compose up -d
```

### Rollback

```bash
# Via GitHub Actions
# Actions → Rollback Frontend Deployment → Run workflow
# Informar tag da imagem (ex: main-abc1234)

# Ou local
./scripts/rollback.sh main-abc1234
```

### Vercel (Alternativa)
1. Conecte o repositório
2. Configure `NEXT_PUBLIC_API_URL` nas environment variables
3. Deploy automático

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/amazing`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Rode os testes (`npm test`)
5. Push para a branch (`git push origin feature/amazing`)
6. Abra um Pull Request

## 📝 Checklist antes de commit

- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] `npm test` passa
- [ ] Coverage mantém 70%+

## 🐛 Problemas Conhecidos

Nenhum no momento. Abra uma issue se encontrar algo!

## 📄 Licença

MIT

## 👥 Time

Desenvolvido com ❤️ por [Seu Time]

---

**Versão**: 2.0.0 (Refatorado em 2024-12-21)
**Status**: ✅ Produção
