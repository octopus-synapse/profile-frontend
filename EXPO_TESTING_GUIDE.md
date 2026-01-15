# 📱 Guia: Testar Profile Mobile via Expo Go no iPhone

## Pré-requisitos

### No Seu Mac/PC:

- ✅ Node.js instalado
- ✅ Bun instalado
- ✅ Git
- ✅ profile-frontend clonado

### No Seu iPhone:

- ✅ Expo Go app instalado (App Store)
- ✅ Conectado na **mesma rede Wi-Fi** que seu Mac/PC

---

## 🚀 Passo 1: Preparar o Ambiente

### 1.1 Navegar até o projeto mobile:

```bash
cd /home/ilelo/Documents/Projects/profile/profile-frontend/apps/mobile
```

### 1.2 Verificar dependências:

```bash
bun install
```

### 1.3 Criar arquivo de ambiente (se não existir):

```bash
cat > .env.local << 'EOF'
# API Backend
EXPO_PUBLIC_API_URL=http://192.168.1.X:3001/api
EXPO_PUBLIC_APP_NAME=ProFile

# Substitua 192.168.1.X pelo IP do seu Mac/PC
EOF
```

**⚠️ IMPORTANTE:** Descobrir o IP do seu Mac/PC:

**macOS:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux:**

```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows:**

```cmd
ipconfig | findstr IPv4
```

Exemplo de output:

```
inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

👉 Use `192.168.1.100` no `.env.local`

---

## 🔧 Passo 2: Configurar Backend (profile-services)

O mobile app precisa se conectar ao backend. Certifique-se de que ele aceita conexões externas:

### 2.1 No profile-services, editar `.env`:

```bash
cd /home/ilelo/Documents/Projects/profile/profile-services
```

Editar `.env`:

```bash
# Permitir conexões de qualquer IP na rede local
HOST=0.0.0.0
PORT=3001

# CORS - Adicionar IP do mobile
CORS_ORIGINS=http://localhost:3000,http://192.168.1.100:8081,exp://192.168.1.100:8081
```

### 2.2 Iniciar backend:

```bash
bun run dev
```

Você deve ver:

```
🚀 Server running on http://0.0.0.0:3001
```

### 2.3 Testar conectividade do iPhone:

No iPhone, abrir Safari e acessar:

```
http://192.168.1.X:3001/api/health
```

Se retornar JSON com `"status": "ok"`, está funcionando! ✅

---

## 📲 Passo 3: Iniciar Expo Dev Server

### 3.1 Voltar para o mobile app:

```bash
cd /home/ilelo/Documents/Projects/profile/profile-frontend/apps/mobile
```

### 3.2 Iniciar Expo:

```bash
bun run start
```

ou

```bash
npx expo start
```

### 3.3 Você verá um QR Code no terminal:

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

█████████████████████████████████
█████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄▀▀▄ ▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▄ █▀ █ █   █ ████
████ █▄▄▄█ █▀ █▀▀██▀▄ █ █▄▄▄█ ████
...
```

---

## 📱 Passo 4: Conectar iPhone

### 4.1 Abrir Expo Go no iPhone

### 4.2 Escanear QR Code:

- **iOS 16+:** Usar Camera app nativa → Abre automaticamente no Expo Go
- **iOS 15-:** Abrir Expo Go → "Scan QR Code" → Escanear

### 4.3 Aguardar Build:

```
 BUNDLE  ./index.js

 iOS Bundling complete 23456ms
```

### 4.4 App abre automaticamente! 🎉

---

## 🐛 Troubleshooting

### Problema 1: "Network request failed"

**Causa:** iPhone não consegue acessar o backend.

**Fix:**

1. Verificar se iPhone e Mac estão na **mesma rede Wi-Fi**
2. Verificar IP no `.env.local` está correto
3. Testar `http://192.168.1.X:3001/api/health` no Safari do iPhone
4. Desabilitar firewall temporariamente:
   ```bash
   # macOS
   sudo pfctl -d  # Desabilitar
   sudo pfctl -e  # Habilitar
   ```

### Problema 2: "Something went wrong"

**Causa:** Erro no código ou dependências faltando.

**Fix:**

```bash
# Limpar cache
npx expo start -c

# Ou
rm -rf node_modules .expo
bun install
bun run start
```

### Problema 3: QR Code não aparece

**Causa:** Porta já em uso.

**Fix:**

```bash
# Matar processo na porta 8081
lsof -ti:8081 | xargs kill -9

# Iniciar novamente
bun run start
```

### Problema 4: "Unable to resolve module"

**Causa:** Dependências do workspace não resolvidas.

**Fix:**

```bash
# No root do profile-frontend
bun install

# Rebuildar packages
cd packages/api-client && bun run build
cd packages/stores && bun run build
cd packages/features && bun run build  # Se existir

# Voltar para mobile
cd ../../apps/mobile
bun run start
```

### Problema 5: Firewall bloqueando

**macOS:**

```bash
# Adicionar exceção para Node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

**Linux (ufw):**

```bash
sudo ufw allow 8081
sudo ufw allow 3001
```

---

## 🔥 Hot Reload

Ao fazer mudanças no código, o app **recarrega automaticamente**!

### Testar:

1. Editar `apps/mobile/app/index.tsx`
2. Salvar
3. Ver reload instantâneo no iPhone ⚡

### Forçar reload manual:

- Shake o iPhone → "Reload"
- Ou pressionar `r` no terminal do Expo

---

## 📊 Modo de Desenvolvimento

### Ver logs do dispositivo:

Terminal do Expo mostra logs em tempo real:

```
LOG  [Analytics] USER_PROFILE_VIEWED {"userId": "123"}
ERROR TypeError: Cannot read property 'name' of undefined
```

### DevTools:

- Shake iPhone → "Debug Remote JS" → Abre Chrome DevTools
- Ou usar React Native Debugger

### Performance Monitor:

- Shake iPhone → "Show Perf Monitor"
- Ver FPS, JS thread usage, etc.

---

## 🎯 Comandos Úteis

### Iniciar em modo específico:

```bash
# Apenas iOS (abre automaticamente no simulador se disponível)
bun run ios

# Apenas Android
bun run android

# Web (testa no browser)
bun run web

# Produção local (minificado)
npx expo start --no-dev --minify
```

### Limpar tudo:

```bash
npx expo start -c      # Limpar cache
watchman watch-del-all # Limpar watchman (se instalado)
```

### Ver túneis disponíveis:

```bash
npx expo start --tunnel  # Usar Ngrok para acesso externo (sem mesma rede)
```

---

## 📱 Testando Funcionalidades

### 1. Autenticação:

- Testar login/logout
- Verificar tokens sendo salvos em SecureStore
- Testar refresh token

### 2. API Calls:

- Verificar requests no terminal:
  ```
  GET http://192.168.1.100:3001/api/v1/users/me
  ```

### 3. Navegação:

- Testar tabs bottom
- Testar deep linking: `exp://192.168.1.100:8081/--/profile`

### 4. Estado (Zustand):

- Ver estado no React DevTools
- Testar persistência com AsyncStorage

---

## 🚢 Build para Testing (Opcional)

Para criar build de development para testar sem Expo Go:

### iOS (requer Mac + Xcode):

```bash
npx expo run:ios
```

### Android:

```bash
npx expo run:android
```

---

## 📚 Referências

- [Expo Go Docs](https://docs.expo.dev/get-started/expo-go/)
- [Debugging](https://docs.expo.dev/debugging/runtime-issues/)
- [Network Config](https://docs.expo.dev/guides/customizing-metro/#network-configuration)

---

## ✅ Checklist Final

Antes de começar a testar:

- [ ] Backend rodando em `0.0.0.0:3001`
- [ ] `.env.local` com IP correto
- [ ] iPhone na mesma rede Wi-Fi
- [ ] Expo Go instalado no iPhone
- [ ] Firewall permite porta 8081 e 3001
- [ ] `bun run start` executando
- [ ] QR code escaneado
- [ ] App aberto no Expo Go

**Happy Testing! 🎉**
