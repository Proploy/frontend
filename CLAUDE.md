# Claude Code Configuration — Proploy Frontend

Conventions and guardrails for working in this app. See `README.md` for the full
architecture reference, and `../PRODUCT.md` / `../DESIGN.md` for product context
and the design system.

## What Proploy is

A **B2B two-sided marketplace** connecting **businesses** (buyers needing software
implementations — CRM/ERP/data/security rollouts) with **vetted implementation
experts**. It spans the lifecycle: discovery & matching → briefs/RFP → contracts →
project workspace (kanban, time tracking, milestones) → escrow-backed payments →
global tax & compliance. Roles: `user`, `expert`, `business`, `admin`.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5**
- **Tailwind CSS 4** — design tokens live in `app/globals.css` (`@theme`)
- **Supabase** (SSR) for auth/session/DB · **Zod** for contract validation
- **service-apis** (FastAPI, port 8020) is the backend gateway
- **framer-motion** for motion · **lucide-react** for icons · **Prisma** where direct DB access is needed
- Package manager: **npm**

## Coding standards

### Styling & design system
- Use the design tokens in `app/globals.css`: `--color-*` (brand/gray/success/warning/error + semantic text/bg/border), `--text-*` / `--leading-*`, `--radius-*`, `--spacing-*`, and the `.text-*` / `.display-*` typography utilities.
- **Established convention:** dashboard/app components use inline hex that mirrors the token values (e.g. `#155eef` = `--color-brand-600`, `#181d27` = `--color-text-primary`, `#717680` = `--color-text-quaternary`). Match the surrounding file — don't mix `var(--color-…)` and hex in the same component.
- Fonts: DM Sans (`--font-dm-sans`, weights 400/500/600/700 — **no** `font-black`/900) and Inter (`--font-inter`), wired in `app/layout.tsx`.
- Body text must clear **4.5:1** contrast; `#717680` on white is the lightest acceptable body gray.

### Architecture
- **service-apis access is split:** `lib/service-apis/browser.ts` (`ServiceApisBrowserClient`, client-only) vs `lib/service-apis/server.ts` (`serviceApisFetch`, server-only). Never import the server module into a client component.
- **Auth:** `components/providers/auth-provider.tsx` exposes `useAuth()` on the client; server code uses `lib/auth.ts` (`getUser`, `getUserWithProfile`, `getUserRole`, `requireExpert`, `requireApprovedExpert`, `requireBusiness`, `isAdmin`).
- **Catalog types** flow contracts → view models → mappers (`hooks/types/*`, `hooks/mappers/*`); pages never import contract types directly.

### Dashboards
- Shared chrome: `components/dashboard/DashboardChrome.tsx` (`DashboardChrome`, `DashboardSidebar`, `DashboardEmptyState`, `BUTTON_SKEUO`, `CARD_SHADOW`). Both workspaces consume it via thin frames:
  - Expert: `components/experts/dashboard/ExpertDashboardFrame.tsx`
  - Business: `components/business/dashboard/BusinessDashboardFrame.tsx`
- **Mock-first:** dashboards render from typed fixtures so UI works without a live backend. Toggle the expert dashboard auth/data bypass with `NEXT_PUBLIC_DASHBOARD_MOCK=1` (dev only — never in production). Fixtures: `lib/service-apis/dashboard-mock.ts`, `lib/service-apis/expert-workspace-mock.ts`, `lib/service-apis/business-dashboard-mock.ts`. Each fixture is shaped to later map onto a real `/api/v1/...` response.
- Motion: stagger card reveals with framer-motion and always honor `useReducedMotion()`.

### File organization
- Routes: `app/` (route groups: `(marketing)`, `(landing-page)`, `(auth)`, `(onboarding)`). Components: `components/`. Hooks: `hooks/`. Non-React libs: `lib/`. Onboarding scaffold (config-driven, reusable across roles): `components/onboarding/*` + `config/onboarding-form.ts`.

## Figma Integration

- **Workflow**: Figma designs → React components (TypeScript). Assets in `/public/figma-assets/`.

### CRITICAL: Figma MCP Export CSS Variable Translation

The Figma MCP export generates CSS class patterns with **slash-separated CSS variable names** that DO NOT exist in this project. They silently fall back to wrong values, causing fonts/weights to render incorrectly. **You MUST fix these every time you import Figma code.**

**Font-family** — Replace ALL of these with `font-[family-name:var(--font-dm-sans)]`:
- `font-[family-name:var(--font-family\/font-family-body,'DM_Sans:...',sans-serif)]`
- `font-[family-name:var(--font-family\/font-family-display,'DM_Sans:...',sans-serif)]`
- `font-['DM_Sans:Bold',sans-serif]`, `font-['DM_Sans:Regular',sans-serif]`, etc.

**Font-weight** — Replace ALL of these with standard Tailwind classes:
- `font-[var(--font-weight\/semibold,normal)]` → `font-semibold`
- `font-[var(--font-weight\/medium,normal)]` → `font-medium`
- `font-[var(--font-weight\/bold,normal)]` → `font-bold`

**Why**: Next.js font loader creates `--font-dm-sans` and `--font-inter` CSS variables (defined in `app/layout.tsx`). DM Sans is loaded with weights 400/500/600/700 only — weight 900 (`font-black`) is NOT available.

**Post-import checklist**: After ANY Figma import, search for `font-family\/`, `font-weight\/`, `'DM_Sans:`, `'Inter:` and fix all occurrences. Zero broken references should remain.

## How to Work with Claude Code
- Use `/help` for Claude Code help.
- Lint: `npm run lint`. Build/type-check: `npm run build`. Tests: `vitest`.
