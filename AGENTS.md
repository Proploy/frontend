# AGENTS.md — frontend/

Next.js 16 public-facing app. App Router, React 19, Tailwind 4, Supabase.
No React Query or other server-state library.

## Layout

- `app/` — App Router pages. `app/api/` holds only `auth/` and the backend proxy
- `components/` — shared UI
- `features/` — feature modules
- `hooks/` — generic API layer: `types/` and `mappers/`
- `lib/` — utilities and the `service-apis` clients
- `proxy.ts` — CSP and the authenticated-route gate

There is no `src/` directory and no `lib/api.ts`. `prisma/` holds a schema only;
nothing at runtime imports it.

## Existing harness (kept as-is)

- `.claude/agents/{frontend,planner,checker}.md`
- `.claude/skills/{commit,design-feature,skill-creator,update-claude-md}/`
- `.codex/agents/{frontend,planner,checker}.toml`
- `.agents/skills/{commit,design-feature,skill-creator,update-claude-md}/`

## New harness (added by this workspace)

| Skill | Path |
|---|---|
| `repo-orient` | `.claude/skills/repo-orient/SKILL.md` |
| `feature-plan` | `.claude/skills/feature-plan/SKILL.md` |
| `frontend-change-review` | `.claude/skills/frontend-change-review/SKILL.md` |
| `qa-runbook` | `.claude/skills/qa-runbook/SKILL.md` |
| `security-pass` | `.claude/skills/security-pass/SKILL.md` |
| `release-checklist` | `.claude/skills/release-checklist/SKILL.md` |

The Codex mirror lives in `.agents/skills/<name>/SKILL.md`.

## Commands

See `docs/agent-harness/repo-commands.md` or `frontend/CLAUDE.md`.

## Hard rules

1. Read `frontend/CLAUDE.md` before editing this repo.
2. Use `var(--font-dm-sans)` / `var(--font-inter)` for fonts. Never use the
   Figma-export slash-separated CSS variable names.
3. Do not use `font-black` — DM Sans is loaded with weights 400/500/600/700.
4. No inline styles. Tailwind only.
5. Never dark text on a solid blue (or ink) fill, in any component. Use
   `className="pp-btn pp-btn--cobalt"`, which `app/v2-pages.css` already guards
   for the control, its children and its SVGs. A bespoke one-class rule loses
   its `color` to the `.pp-scope button{color:inherit}` reset and renders
   near-black on blue with no error. See "Styling" in `frontend/CLAUDE.md`.
6. Ask before installing new dependencies.