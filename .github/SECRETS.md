# GitHub Actions Secrets Configuration

Este documento lista todos os secrets necessários para o CI/CD funcionar corretamente.

## Como Configurar

1. Acesse o repositório no GitHub
2. Vá em `Settings` → `Secrets and variables` → `Actions`
3. Clique em `New repository secret`
4. Adicione cada secret listado abaixo

## Secrets Obrigatórios

### SSH e Infraestrutura

#### `VM_SSH_PRIVATE_KEY`
- **Descrição**: Chave SSH privada para acessar a VM de deploy
- **Formato**: Chave privada completa (incluindo header e footer)
- **Exemplo**:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```
- **Como gerar**:
  ```bash
  ssh-keygen -t ed25519 -C "github-actions-deploy"
  cat ~/.ssh/id_ed25519  # Copie todo o conteúdo
  ```

#### `VM_HOST`
- **Descrição**: Host ou IP da VM de destino
- **Formato**: IP ou hostname
- **Exemplo**: `192.168.1.100` ou `vm.example.com`

#### `VM_USER`
- **Descrição**: Usuário SSH para acessar a VM
- **Formato**: Nome de usuário
- **Exemplo**: `deploy` ou `ubuntu`

### Aplicação Frontend

#### `FRONTEND_PORT`
- **Descrição**: Porta onde o frontend será executado
- **Formato**: Número da porta
- **Exemplo**: `3000`
- **Padrão**: `3000`

#### `NEXT_PUBLIC_API_URL`
- **Descrição**: URL completa do backend API (acessível do navegador)
- **Formato**: URL completa
- **Exemplo**: `https://api.example.com` ou `http://192.168.1.100:3001`
- **Importante**: Deve ser acessível do navegador do usuário

#### `NEXTAUTH_URL`
- **Descrição**: URL base da aplicação frontend
- **Formato**: URL completa
- **Exemplo**: `https://app.example.com` ou `http://192.168.1.100:3000`
- **Importante**: URL onde a aplicação estará rodando

#### `NEXTAUTH_SECRET`
- **Descrição**: Secret para criptografia do NextAuth.js
- **Formato**: String aleatória de 32+ caracteres
- **Exemplo**: `aB3dEf9gH1jK4lM6nO8pQ0rS2tU5vW7xY9zA1bC3dE`
- **Como gerar**:
  ```bash
  openssl rand -base64 32
  ```
- **Importante**: NUNCA compartilhe este valor

## Secrets Automáticos (GitHub)

Estes secrets são fornecidos automaticamente pelo GitHub:

### `GITHUB_TOKEN`
- **Descrição**: Token para autenticação do GitHub Actions
- **Uso**: Push de imagens Docker para GitHub Container Registry
- **Importante**: Não precisa ser configurado manualmente

## Validação

Para validar se os secrets estão configurados corretamente:

1. Execute o workflow de CI em uma branch de teste
2. Verifique os logs para erros de autenticação
3. Execute o workflow de CD manualmente (`workflow_dispatch`)
4. Verifique se o deploy foi bem-sucedido

## Segurança

- ✅ Nunca compartilhe secrets em commits ou PRs
- ✅ Use secrets diferentes para dev/staging/production
- ✅ Rotacione secrets regularmente (a cada 90 dias)
- ✅ Revogue imediatamente secrets comprometidos
- ✅ Use princípio do menor privilégio (mínimas permissões necessárias)
- ❌ Nunca faça hardcode de secrets no código
- ❌ Nunca inclua secrets em logs ou outputs

## Troubleshooting

### Erro: "Permission denied (publickey)"
- Verifique se `VM_SSH_PRIVATE_KEY` está corretamente configurado
- Verifique se a chave pública está em `~/.ssh/authorized_keys` na VM
- Verifique se o usuário `VM_USER` existe na VM

### Erro: "Connection refused"
- Verifique se `VM_HOST` está correto
- Verifique se a VM está acessível da internet/GitHub Actions
- Verifique firewall da VM (porta 22 SSH deve estar aberta)

### Erro: "Health check failed"
- Verifique se `FRONTEND_PORT` está correto
- Verifique se `NEXT_PUBLIC_API_URL` está acessível
- Verifique logs do container: `docker logs profile-frontend`

### Erro: "Invalid NEXTAUTH_SECRET"
- Verifique se o secret tem pelo menos 32 caracteres
- Re-gere o secret usando `openssl rand -base64 32`

## Template de Checklist

Use este checklist ao configurar um novo ambiente:

- [ ] `VM_SSH_PRIVATE_KEY` configurado
- [ ] `VM_HOST` configurado
- [ ] `VM_USER` configurado
- [ ] `FRONTEND_PORT` configurado
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] `NEXTAUTH_URL` configurado
- [ ] `NEXTAUTH_SECRET` gerado e configurado
- [ ] Chave pública SSH adicionada à VM
- [ ] Network `profile-network` criada na VM
- [ ] Firewall configurado (portas necessárias abertas)
- [ ] Workflow de CI executado com sucesso
- [ ] Workflow de CD executado com sucesso
- [ ] Health check retornando 200 OK
