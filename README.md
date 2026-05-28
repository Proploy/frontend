# Proploy Frontend

**Version:** 1.0.0  
**Stack:** Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4 · Supabase · Zod

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Data Flow and State Management](#data-flow-and-state-management)
4. [API Contracts and Services](#api-contracts-and-services)
5. [Routing, Layouts, and Navigation](#routing-layouts-and-navigation)
6. [Build, Deployment, and Environment](#build-deployment-and-environment)
7. [Testing Strategy](#testing-strategy)
8. [Performance, Accessibility, and Security](#performance-accessibility-and-security)
9. [Quality and Contributor Guide](#quality-and-contributor-guide)

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Role |
|-------|------------|------|
| Framework | Next.js 16 (App Router) | SSR, routing, API routes |
| UI | React 19 | Component model |
| Language | TypeScript 5 | Type safety across all code |
| Styling | Tailwind CSS 4 | Utility-first styling, design system via CSS variables |
| Auth & DB | Supabase (SSR, anon key, service role) | Authentication, session, database |
| Validation | Zod | Runtime schema validation for API contracts |
| Rate Limiting | Upstash Redis | Per-user request throttling |
| Agent Shell | ProployAgentShell | Persistent chatbot panel across authenticated routes |

### Layering

```
┌─────────────────────────────────────────────────────┐
│                    Pages (app/)                     │  ← Route segments + layouts
├─────────────────────────────────────────────────────┤
│              Components (components/)               │  ← Reusable UI primitives + features
├─────────────────────────────────────────────────────┤
│               Hooks (hooks/)                         │  ← Data fetching, caching, state
├─────────────────────────────────────────────────────┤
│  lib/service-apis/  │  lib/supabase/  │  lib/utils/ │  ← Transport, auth, utilities
├─────────────────────────────────────────────────────┤
│        API Routes (app/api/)  │  External Services  │  ← BFF shims, downstream calls
└─────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Browser / server client split.**  
`lib/service-apis/browser.ts` (client-only) exports `ServiceApisBrowserClient`, which uses `NEXT_PUBLIC_SERVICE_APIS_URL` and resolves Supabase session tokens from the browser. `lib/service-apis/server.ts` exports `serviceApisFetch`, which uses `SERVICE_APIS_BASE_URL` (server-only) and the server-side Supabase client. Never import the server module from client components.

**2. Three-layer catalog types.**  
Catalog data flows through three layers: **contract types** (`hooks/types/catalog-contracts.ts`) mirror the service-apis schemas exactly; **view model types** (`hooks/types/catalog-view-models.ts`) represent what the UI actually renders; **mappers** (`hooks/mappers/catalog-mappers.ts`) convert between them. Pages never import contract types directly.

**3. BFF API routes as compatibility shims.**  
`app/api/` routes proxy requests to `service-apis` and reshape responses. New code should call `ServiceApisBrowserClient` or `serviceApisFetch` directly, bypassing the API route layer where possible.

**4. Auth via context, not middleware.**  
`components/providers/auth-provider.tsx` provides `useAuth()` which surfaces `user`, `expert`, `isLoading`, and session methods. Auth state is client-resolved; server components use `createClient()` from `lib/supabase/server.ts` directly.

---

## Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group — sign-in, sign-up, reset-password
│   ├── admin/                    # Admin-only pages (protected)
│   ├── api/                      # BFF API routes (proxies to service-apis)
│   │   ├── products/             # Product list / detail / search shims
│   │   ├── experts/              # Expert application shims
│   │   ├── admin/                # Admin review shims
│   │   └── favorites/            # User favorites shim
│   ├── products/                 # Product listing and search pages
│   ├── product/[id]/            # Product detail page
│   ├── expert/                   # Expert dashboard (approved experts only)
│   ├── experts/                  # Expert browsing and profile pages
│   ├── become-expert/            # Multi-step expert application form
│   ├── for-businesses/           # Business-facing landing content
│   ├── for-experts/              # Expert-facing landing content
│   ├── auth/                     # Session handling routes
│   ├── layout.tsx                # Root layout — fonts, Navbar, AuthProvider, AgentShell
│   └── globals.css               # Global styles + Tailwind base
│
├── components/                   # Reusable UI
│   ├── ui/                       # Primitive components (Button, Input, Select, Tag…)
│   ├── providers/                # Context providers (AuthProvider)
│   ├── onboarding/               # Expert onboarding step components
│   ├── product/                  # Product-specific components (cards, filters, detail)
│   ├── agent/                    # ProployAgentShell
│   ├── SearchBar.tsx             # Site-wide search bar
│   ├── Navbar.tsx                # Top navigation
│   ├── Footer.tsx                # Footer
│   ├── SearchHero.tsx            # Hero section with search
│   └── FiltersDrawer.tsx         # Mobile filter drawer
│
├── hooks/                        # Data-fetch hooks
│   ├── types/
│   │   ├── catalog-contracts.ts # Backend contract type mirrors
│   │   └── catalog-view-models.ts # UI view model types
│   ├── mappers/
│   │   └── catalog-mappers.ts    # Contract → view model converters
│   └── use-catalog-products.ts  # Public product listing hook
│
├── lib/                         # Shared libraries (no React imports)
│   ├── service-apis/
│   │   ├── browser-client.ts     # ServiceApisBrowserClient class
│   │   ├── browser.ts           # Browser-only entrypoint (exports browser-client)
│   │   ├── server.ts            # Server-only entrypoint (exports serviceApisFetch)
│   │   ├── client.ts            # Core fetch helper + getUserInterests helper
│   │   └── error-utils.ts       # Error normalization + circuit-open detection
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (createClient)
│   │   ├── server.ts            # Server Supabase client (createServerClient)
│   │   └── auth.ts              # Auth helper functions
│   ├── utils/
│   │   ├── errors.ts           # Shared error utilities
│   │   ├── ratelimit.ts        # Upstash rate-limit helper
│   │   ├── auth-intent.ts       # Auth intent (redirect after login)
│   │   └── auth-intent-client.ts
│   ├── validations/
│   │   ├── api.ts              # API response Zod schemas
│   │   └── expert.ts           # Expert form Zod schemas
│   ├── auth.ts                  # Auth utility re-exports
│   └── admin.ts                 # Admin check utilities
│
├── docs/                        # Architecture and onboarding docs
├── scripts/                     # Build and code-generation scripts
├── prisma/                      # Prisma schema (if direct DB access needed)
└── public/                      # Static assets
```

**Key file references:**

| Concern | File |
|---------|------|
| Browser service-apis client | `lib/service-apis/browser-client.ts` |
| Server service-apis fetch | `lib/service-apis/server.ts` |
| Auth context | `components/providers/auth-provider.tsx` |
| Catalog types (contracts) | `hooks/types/catalog-contracts.ts` |
| Catalog types (view models) | `hooks/types/catalog-view-models.ts` |
| Catalog mappers | `hooks/mappers/catalog-mappers.ts` |
| Product listing hook | `hooks/use-catalog-products.ts` |
| Root layout | `app/layout.tsx` |
| Environment config | `env.example` |

---

## Data Flow and State Management

### Public Catalog Flow (no auth)

```
ServiceApisBrowserClient.get('/catalog/products?...')
  → service-apis (port 8020)
  → software-ingestion-pipeline DB
  → catalog-contracts.ts response shape
  → catalog-mappers.ts transforms to view model
  → use-catalog-products.ts hook state
  → products/page.tsx renders
```

### Authenticated User Flow

```
serviceApisFetch('/api/v1/users/me/interests', { requireAuth: true })
  → service-apis (server-side, port 8020)
  → validates Supabase session cookie → JWT
  → responds with user data
  → server component renders with user-specific data
```

### State Stores

| Store | Tool | Scope |
|-------|------|-------|
| Auth session | Supabase `useAuth()` context | Global, client |
| Server data | React Server Components + fetch caching | Per-page, server |
| Client UI state | `useState` / `useReducer` | Local component |
| Form state | Controlled components + Zod | Local or page-level |

No global client-side state manager (Zustand, Redux, etc.) is in use. Server-pushed data is preferred; client state is minimal.

---

## API Contracts and Services

### Service-apis Gateway

All business-logic-bearing calls go through `service-apis` (FastAPI, port 8020), which routes to:

- `software-ingestion-pipeline` (port 8010) — catalog DB
- `agent-harness` (port 8001) — expert AI agent

### Browser Client (`ServiceApisBrowserClient`)

```typescript
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

const client = new ServiceApisBrowserClient()

// Public call — no auth
const { ok, data } = await client.get('/catalog/products', { limit: 20 })

// Auth-required call
const { ok, data } = await client.post('/api/v1/favorites', { product_id }, { requireAuth: true })
```

### Server Fetch (`serviceApisFetch`)

```typescript
import { serviceApisFetch } from '@/lib/service-apis/server'

const res = await serviceApisFetch('/api/v1/users/me/interests', { requireAuth: true })
const { data } = await res.json()
```

### Error Handling

`lib/service-apis/error-utils.ts` exports:
- `normalizeServiceApiError(response)` — converts failed fetch to structured `{ ok: false, status, error: { code, message } }`
- `isCircuitOpen(err)` — detects circuit-breaker-open errors
- `normalizeCircuitOpen(err)` — converts circuit-open to typed 503

### Retry Policy

The service-apis circuit breaker trips after 5 consecutive failures. Browser client shows a user-facing "service temporarily unavailable" message (no automatic retry in client code). Server-side retries are handled by the gateway's own retry logic.

---

## Routing, Layouts, and Navigation

### Route Groups

| Group | Purpose | Auth |
|-------|---------|------|
| `(auth)` | Sign-in, sign-up, password reset | Public |
| `(onboarding)` | Multi-step expert application | Auth required |
| `(landing-page)` | Public marketing content | Public |
| `(legacy-onboarding)` | Old onboarding flow | Auth required |

### Layout Stack

```
RootLayout (app/layout.tsx)
  └── AuthProvider
        └── ProployAgentShell   ← persistent chatbot shell
              └── Navbar
                    └── <main>  ← page content rendered here
```

Authenticated routes render `ProployAgentShell` which provides the persistent chat panel. Public routes skip it.

### Navigation

`components/Navbar.tsx` is the primary navigation bar. Route guards are implemented inline via `useAuth()` — protected routes redirect to `/sign-in` if no session exists.

### Shared Layouts

Pages within a group share layouts via `layout.tsx` files at the group level. No external layout library is used.

---

## Build, Deployment, and Environment

### Build

```bash
npm run dev       # Development server on :3000
npm run build     # Production build (Next.js static + SSR)
npm run start     # Serve production build
npm run lint      # ESLint
```

### Environment Variables

**Browser-exposed** (`NEXT_PUBLIC_*` — safe to bundle):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SERVICE_APIS_URL   # service-apis gateway URL (browser-accessible)
```

**Server-only** (never bundled into browser):
```
SUPABASE_SERVICE_ROLE_KEY      # Server-side Supabase admin
DATABASE_URL                   # Direct DB connection (if needed)
SERVICE_APIS_BASE_URL          # service-apis gateway (server-side proxy)
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
REVALIDATE_TIME
ADMIN_EMAILS
```

See `env.example` for the full scaffold.

### Deployment

Deployed on Vercel (Next.js native adapter). Environment variables are set via Vercel project settings. `NODE_ENV=production` is set automatically.

**Service-apis URL:**
- Dev: `http://localhost:8020`
- Prod: `https://api.proploy.io` (or configured production endpoint)

---

## Testing Strategy

### Unit Tests

Framework: Vitest (via Next.js built-in test runner or Jest)

```bash
npm run test              # Run all tests
npm run test -- --watch  # Watch mode
```

Coverage scope:
- Hook output transformation (contract → view model)
- Zod validation schemas
- Utility functions (ratelimit, auth intent, error normalization)

### Integration Tests

API route tests hitting `app/api/` routes with mocked `service-apis` responses. Use MSW or direct handler testing to avoid real downstream calls.

### Visual / E2E

- Visual diff: `baseline-browser-mapping` (in devDependencies) — captures CSS regressions
- E2E: Playwright (if configured) — covers critical user flows: browse → detail → favorites

### Test Files

```
app/__tests__/              # Integration tests for API routes / pages
__tests__/                 # Shared test utilities
```

---

## Performance, Accessibility, and Security

### Performance

| Metric | Target | Technique |
|--------|--------|-----------|
| LCP | < 2.5 s | Font preload, SSR product pages, image optimization |
| CLS | < 0.1 | Reserved layout space for dynamic content, font `display: swap` |
| TTFB | < 600 ms | Edge caching (Vercel), route segment caching |

**Key techniques:**
- Next.js `<Image>` for all product images (automatic WebP, lazy loading, size optimization)
- Server Components for all data-fetching pages (no client-side waterfall)
- `cache: 'no-store'` on service-apis calls to avoid stale data
- Route segment caching via `fetch` cache options where appropriate

### Accessibility

- Semantic HTML: all interactive elements use `<button>`, `<a>`, `<nav>`
- ARIA labels on icon-only controls (SearchBar, FiltersDrawer)
- Focus management: modal/drawer traps focus, returns focus on close
- Color contrast: all text meets WCAG AA (checked via `baseline-browser-mapping` visual audit)
- Keyboard navigation: all flows accessible without mouse

### Security

| Concern | Mitigation |
|---------|-----------|
| Auth token theft | HttpOnly Supabase cookies; Bearer token never stored in localStorage |
| XSS | React auto-escapes; no `dangerouslySetInnerHTML` without sanitization |
| CSRF | SameSite cookies; server-side origin check on state-changing routes |
| Env exposure | `NEXT_PUBLIC_*` vars are public by definition; secrets use server-only vars |
| Rate limiting | Upstash Redis per-user limits on API routes |
| SQL injection | Prisma parameterized queries; no raw SQL in frontend code |

---

## Quality and Contributor Guide

### Code Standards

- **TypeScript strict mode** — no `any`, explicit return types on exported functions
- **No `console.log` in production code** — use a structured logger or server-side observability
- **Separate client/server modules** — never import `lib/service-apis/server.ts` from client components
- **Error normalization** — always use `normalizeServiceApiError` for service-apis error handling, not raw `response.ok` checks
- **CSS variable discipline** — follow `--font-dm-sans` / `--font-inter` pattern; never hardcode font weight names

### PR Process

1. **New hooks or service layers** — include unit tests for mappers and type transformations
2. **API contract changes** — update `catalog-contracts.ts` first; mappers must be updated in the same PR
3. **New environment variables** — must be added to `env.example` with a comment explaining purpose
4. **Visual changes** — run `baseline-browser-mapping` and attach a screenshot diff to the PR
5. **No Co-Authored-By** — per project policy, commits are authored by the primary contributor only

### Documentation Expectations

- Every new hook file includes a JSDoc comment describing inputs, outputs, and side effects
- API route files (`app/api/`) document their request/response shapes at the top
- Significant architectural decisions are recorded in `docs/superpowers/specs/` or `docs/superpowers/plans/`
- This README is the authoritative high-level view; implementation details belong in inline comments or the handbook

### File Organization Rules

| What | Where |
|------|-------|
| React components (with JSX) | `components/` |
| Data-fetching hooks | `hooks/` |
| Type definitions | `hooks/types/` or co-located near the hook |
| Transport / HTTP clients | `lib/service-apis/` |
| Auth utilities | `lib/supabase/` or `lib/auth.ts` |
| Validation schemas | `lib/validations/` |
| Shared utilities | `lib/utils/` |
| Route handlers | `app/api/` |
| Pages | `app/` (route group or leaf segment) |



## Supabase Auth URL Configuration

For staged production, Supabase Auth should use:

- Site URL: `https://dev-stage1.netlify.app`
- Redirect URLs:
  - `https://dev-stage1.netlify.app/auth/callback`
  - `https://dev-stage1.netlify.app/**`
  - `http://localhost:3000/**` for local testing

Do not leave Site URL as `http://localhost:3000` for staged/production auth testing.

---

*Last updated: 28 May 2026*