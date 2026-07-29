# AI Workspace Sidebar Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `/AI_workspace` a full-height, collapsible, Proploy-branded evaluation sidebar while leaving `/workspace` unchanged.

**Architecture:** Keep the custom evaluation and decision grid. Suppress the global navbar for the AI route, remove the navbar-sized offset from every AI workspace state, and add a route-local brand row to `EvaluationSidebar`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Do not modify `WorkspaceShell` or workspace sidebar behavior.
- Reuse `/PROPLOY.svg`; add no dependency or new image asset.
- Preserve the evaluation list, item actions, mobile drawer, and decision panel.
- Follow test-driven development.

---

### Task 1: Full-height AI workspace route shell

**Files:**
- Modify: `app/AI_workspace/page.test.tsx`
- Modify: `components/Navbar.tsx`
- Modify: `components/ai-workspace/SoftwareProcurementWorkspace.tsx`

**Interfaces:**
- Consumes: `Navbar` route suppression through `WORKSPACE_PREFIXES`.
- Produces: `/AI_workspace` rendering with `h-dvh` and without `mt-[80px]` or `h-[calc(100dvh-80px)]`.

- [ ] **Step 1: Write the failing route-shell test**

Update `app/AI_workspace/page.test.tsx` to assert:

```ts
expect(navbarSource).toContain("'/AI_workspace'")
expect(workspaceSource).toContain('h-dvh')
expect(workspaceSource).not.toContain('mt-[80px]')
expect(workspaceSource).not.toContain('h-[calc(100dvh-80px)]')
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- app/AI_workspace/page.test.tsx
```

Expected: failure because the route is not suppressed and the old 80-pixel offset remains.

- [ ] **Step 3: Implement the minimal shell change**

Add `'/AI_workspace'` to `WORKSPACE_PREFIXES`. Replace the three AI workspace root-state offset/height combinations with `h-dvh`, retaining the existing overflow and flex/grid behavior.

- [ ] **Step 4: Run the test and verify GREEN**

Run:

```bash
npm test -- app/AI_workspace/page.test.tsx
```

Expected: pass.

### Task 2: Branded evaluation sidebar

**Files:**
- Modify: `components/ai-workspace/EvaluationSidebar.test.tsx`
- Modify: `components/ai-workspace/EvaluationSidebar.tsx`
- Modify: `components/ai-workspace/SoftwareProcurementWorkspace.tsx`

**Interfaces:**
- Consumes: `collapsed`, `onToggleCollapsed`, and optional `onClose`.
- Produces: a sidebar brand row containing `/PROPLOY.svg`, a desktop collapse/expand control, and a mobile close control.

- [ ] **Step 1: Write failing expanded and collapsed sidebar tests**

Render the sidebar expanded, assert an image with alt text `Proploy` and the `Collapse evaluations` button, rerender collapsed, and assert the wordmark is absent while `Expand evaluations` remains:

```ts
expect(view.container.querySelector('img[alt="Proploy"]')).not.toBeNull()
expect(view.container.querySelector('button[aria-label="Collapse evaluations"]')).not.toBeNull()
// rerender collapsed
expect(view.container.querySelector('img[alt="Proploy"]')).toBeNull()
expect(view.container.querySelector('button[aria-label="Expand evaluations"]')).not.toBeNull()
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
npm test -- components/ai-workspace/EvaluationSidebar.test.tsx
```

Expected: failure because the sidebar has no brand image.

- [ ] **Step 3: Implement the minimal brand row**

Import `Image` and `Link`. Add a border-bottom brand row at the top of the sidebar, render `/PROPLOY.svg` only while expanded, and move the existing collapse/close control into this row. Keep the `EVALUATIONS` label as a separate section heading below it. Update the loading skeleton’s sidebar top area to match the new brand-row height.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run:

```bash
npm test -- components/ai-workspace/EvaluationSidebar.test.tsx app/AI_workspace/page.test.tsx components/ai-workspace/SoftwareProcurementWorkspace.test.tsx
```

Expected: pass.

- [ ] **Step 5: Run frontend verification**

Run:

```bash
npx eslint app/AI_workspace/page.test.tsx components/Navbar.tsx components/ai-workspace/EvaluationSidebar.tsx components/ai-workspace/EvaluationSidebar.test.tsx components/ai-workspace/SoftwareProcurementWorkspace.tsx
npm test
npm run build
```

Expected: changed-file lint, all tests, and production build pass. Repository-wide lint’s unrelated pre-existing failures remain documented separately.
