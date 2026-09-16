# CLAUDE.md

Authoritative description of `frontend/`. Skills point here rather than
restating these facts. When something here conflicts with a skill, this file
wins, and the skill is the thing to fix.

## Working Directory

All commands run from `frontend/`. Copy `env.example` to `.env` before the first
run. The file is `env.example`, with no leading dot.

## Stack

Next.js 16.2.11 (Turbopack), React 19, TypeScript 5, Tailwind CSS 4, Supabase,
Sanity, Vitest. Regenerate with `node -e "console.log(require('./package.json').dependencies)"`.

There is no React Query, SWR, or any other server-state library. There is no
`lib/api.ts`. Prisma appears in `package.json` and `prisma/schema.prisma`, but
nothing in `app/`, `features/`, `hooks/`, `lib/`, or `components/` imports it.
The only reader of `DATABASE_URL` is `prisma.config.ts`, a command-line file.
Do not set `DATABASE_URL` to run the app.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # next build
npm run test       # vitest run
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

**`npm run build` does not check types.** It is bare `next build`, and
`next.config.ts` sets `typescript.ignoreBuildErrors: true`. A type error builds
clean and ships. `npm run typecheck` is the only gate, and nothing in CI or
Cloud Build runs it. Run it before you claim a change is done.

## Layout

There is no `src/` directory.

```text
app/           App Router. app/api holds only auth/ and the backend proxy
features/      9 domain slices: hooks, formatting, domain components, tests
hooks/         Generic API layer: types/ (contracts) and mappers/
components/    Reusable UI
lib/           Integrations and utilities, including the service-apis clients
proxy.ts       CSP construction and the authenticated-route gate
```

`features/` holds domain meaning. `hooks/` holds the generic boundary: the typed
contract mirroring the backend model, and the mapper to a view model.
Infrastructure belongs in `lib/`, never in `features/`.

## Reaching the Backend

The browser never calls `service-apis` directly and never holds a token for it.
`ServiceApisBrowserClient` rewrites every request to `/api/proxy/<path>`, a
route in this app that attaches the token server-side.

`app/api/proxy/[...path]/route.ts` strips `x-require-auth`, `host`, and
`x-agent-key` from the incoming request, then decides whether to attach a token
from `AUTH_REQUIRED_PREFIXES`, a server-side path allowlist. A browser cannot
influence that decision.

**When you add an authenticated backend route, add its prefix to
`AUTH_REQUIRED_PREFIXES` in the same change.** Skip it and the proxy forwards
with no token, producing a 401 with no obvious cause. Nothing enforces that this
list stays in step with `service-apis`.

`lib/service-apis/client.ts` forwards only `content-type`, `accept`,
`accept-language`, `accept-encoding`, `cache-control`, and `range` upstream. A
header added anywhere else does not arrive at the backend unless you add it
here too.

Import `@/lib/service-apis/browser` in client components and
`@/lib/service-apis/server` in server components and route handlers. With no
backend origin configured, `serviceApisFetch` returns an empty stub response
instead of failing, so a page that renders with no data usually means
`NEXT_PUBLIC_SERVICE_APIS_URL` is unset.

The contact form is the one deliberate exception: `ContactForm.tsx` and
`ClosingCTA.tsx` post straight to `${NEXT_PUBLIC_SERVICE_APIS_URL}/api/v1/contact`.
That endpoint is public and needs no token. A new authenticated call written
this way has no token and fails.

## Failures That Are Silent

A browser call to an origin missing from `connect-src` in `proxy.ts` is blocked
by the Content Security Policy with no server-side trace.

`app/api/proxy/[...path]/route.ts` logs nothing, so a backend 500 reaches the
browser with no record here. Read the `service-apis` logs for the cause.

There is no health route anywhere under `app/`, which is why the Cloud Run
deploy has no startup probe.

## Figma Integration

- **Workflow**: Figma designs → React components
- **Tool**: Figma MCP Server for asset handling
- **Output Format**: React components with TypeScript
- **Asset Management**: Images stored in `/public/figma-assets/`

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

```bash
grep -rEn "font-family\\\\/|font-weight\\\\/|'DM_Sans:|'Inter:" app components features lib
```

## Styling

Tailwind only. No inline styles. Fonts via `var(--font-dm-sans)` and
`var(--font-inter)`. Never `font-black`.

## Deployment

Cloud Run service `proploy-frontend` in `australia-southeast1`, built by
`cloudbuild.yaml` on a push to `master`. Images tag `:latest` rather than the
commit SHA, so a revision does not record which commit it holds. No test runs
between push and deploy, and every deploy takes 100% of traffic at once.
