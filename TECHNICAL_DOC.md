# Documentação Técnica – Feira Agropec 2025

## Sumário

- [Descrição do Projeto](#descrição-do-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Principais Componentes](#principais-componentes)
- [Hooks Customizados](#hooks-customizados)
- [Camada de Dados (Prisma)](#camada-de-dados-prisma)
- [APIs e Rotas](#apis-e-rotas)
- [Scripts e Comandos](#scripts-e-comandos)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Como Contribuir](#como-contribuir)
- [Observações](#observações)

---

## Descrição do Projeto

**Feira Agropec** é uma aplicação web desenvolvida em Next.js para gerenciar e divulgar a Feira Agropecuária de Paragominas. O sistema oferece funcionalidades para exibição de eventos, expositores, notificações, programação, mapa interativo, favoritos, além de um painel administrativo completo.

---

## Principais Funcionalidades

- **Página pública** com informações, destaques, programação, expositores, mapa e notificações.
- **Favoritos**: usuários podem marcar eventos e expositores como favoritos.
- **Notificações push**: integração com web-push para envio de notificações.
- **Mapa interativo** dos expositores.
- **Painel administrativo**: CRUD de eventos, expositores, notificações, configurações e gerenciamento de slides do carrossel.
- **Autenticação** para área administrativa.
- **Estatísticas** em tempo real para admins.

---

## Estrutura de Pastas

```
app/
  (site)/         # Rotas públicas (home, expositores, favoritos, mapa, notificações, programação)
  admin/          # Rotas administrativas (dashboard, CRUD, login)
  api/            # Rotas de API (REST)
components/       # Componentes reutilizáveis (UI, cards, carrossel, mapas, etc)
components/admin/ # Componentes exclusivos do admin
components/ui/    # Componentes de interface (botões, cards, etc)
features/         # Componentes server-side (SSR)
hooks/            # Hooks customizados
lib/              # Funções utilitárias, camada de dados (db.ts), tipos, autenticação, notificações
prisma/           # Schema do banco, seeds e migrações
public/           # Assets estáticos (imagens, manifest, sw.js)
scripts/          # Scripts utilitários (ex: geração de VAPID keys)
styles/           # CSS global e configurações do Tailwind
```

---

## Principais Componentes

- `HeroSection`, `HeroCarousel`, `HomeContent`: destaques da home.
- `ExhibitorCard`, `EventCard`: cards de expositores e eventos.
- `MapContainer`, `MapLegend`, `ExhibitorsMap`: mapa interativo.
- `NotificationItem`, `PushNotificationManager`: notificações e push.
- `AdminSidebar`, `EventForm`, `ExhibitorForm`, `CarouselManager`: componentes do painel admin.
- `ConditionalFooter`, `ConditionalNavbar`, `ThemeProvider`, `InstallPWA`: utilidades globais.

---

## Hooks Customizados

- `useMobile`: detecta se o usuário está em dispositivo móvel.
- `useToast`: gerenciamento de toasts.
- `useFavoritesContext`: contexto de favoritos.

---

## Camada de Dados (Prisma)

- **Banco:** PostgreSQL (configurado via `prisma/schema.prisma`)
- **Modelos:** `Event`, `Exhibitor`, `Notification`, `User`, `CarouselSlide`, `PushSubscription`, `SiteSettings`
- **Enums:** `NotificationType`, `UserRole`
- **Seed:** `prisma/seed.ts` cria dados iniciais (admin, eventos, etc).

---

## APIs e Rotas

- **REST API** (em `/app/api/`):

  - `/api/events` – CRUD de eventos
  - `/api/exhibitors` – CRUD de expositores
  - `/api/notifications` – CRUD de notificações
  - `/api/user` – gerenciamento de usuários
  - `/api/settings` – configurações do site
  - `/api/stats` – estatísticas gerais

- **Rotas públicas**: Home, Expositores, Favoritos, Mapa, Notificações, Programação
- **Rotas admin**: Dashboard, CRUD, Configurações, Login

---

## Scripts e Comandos

- `pnpm dev` – inicia o servidor de desenvolvimento
- `pnpm build` – build de produção
- `pnpm start` – inicia o servidor em produção
- `pnpm prisma:migrate` – executa migrações do banco
- `pnpm prisma:studio` – abre o Prisma Studio
- `pnpm prisma:seed` – executa o seed do banco

---

## Como Rodar o Projeto

1. **Instale as dependências:**
   ```sh
   pnpm install
   ```
2. **Configure as variáveis de ambiente** (`.env`):
   - `DATABASE_URL`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
3. **Rode as migrações e o seed:**
   ```sh
   pnpm prisma:migrate
   pnpm prisma:seed
   ```
4. **Inicie o servidor:**
   ```sh
   pnpm dev
   ```

---

## Como Contribuir

- Faça um fork do repositório.
- Crie uma branch para sua feature/fix.
- Envie um Pull Request com uma descrição clara.

---

## Observações

- O projeto utiliza **Next.js 15**, **TypeScript**, **TailwindCSS** e **Prisma**.
- O painel admin é protegido por autenticação.
- Notificações push requerem configuração de VAPID keys.
- O banco de dados padrão é PostgreSQL.
- O projeto está preparado para PWA.

---
