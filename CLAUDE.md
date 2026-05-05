# Claude Code Configuration

This file documents conventions, guidelines, and preferences for working with Claude Code on this project.

## Project Overview
- **Type**: Frontend (React)
- **Purpose**: Proploy frontend application

## Coding Standards

### Structure & Conventions
- **Language**: JavaScript/TypeScript
- **Framework**: React
- **Styling**: [Add your styling approach - Tailwind, CSS Modules, styled-components, etc.]
- **Package Manager**: [npm/yarn/pnpm]

### File Organization
- Components go in `/src/components/`
- Pages/routes go in `/src/pages/`
- Utils/helpers go in `/src/utils/`
- Styling in co-located files or `/src/styles/`

## Key Decisions & Rationale
- Document important architectural decisions here
- Note any constraints or preferences

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

## Team Preferences
- Code review requirements: [What should be reviewed]
- Testing standards: [Unit/integration/E2E expectations]
- PR process: [Any special requirements]

## How to Work with Claude Code
- Use `/help` for Claude Code help
- Report issues at https://github.com/anthropics/claude-code/issues
