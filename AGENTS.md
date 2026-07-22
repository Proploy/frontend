# AGENTS.md — frontend/

Next.js 14 public-facing app. App Router, React, Tailwind, React Query.

## Layout

- `app/` — App Router pages
- `components/` — shared UI
- `features/` — feature modules
- `hooks/` — shared custom hooks
- `lib/` — utilities, API client, constants
- `prisma/` — Prisma schema and client

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
5. Ask before installing new dependencies.