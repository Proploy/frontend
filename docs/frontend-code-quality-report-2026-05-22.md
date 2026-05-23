# Frontend Code Quality Report

**Date:** 2026-05-22
**Scanner:** react-doctor (score: 56/100)
**Scope:** Full frontend (`/app`, `/components`, `/hooks`)

---

## Executive Summary

The frontend currently scores **56/100** on react-doctor's quality rubric. The score reflects real correctness and security issues — not cosmetic warnings. The most critical are:

- **6 instances of `target="_blank"` without `rel="noreferrer"`** — a confirmed security vulnerability (opener tab hijacking)
- **3 instances of `dangerouslySetInnerHTML`** — potential XSS vector (currently low-risk as content is hardcoded)
- **11–19 instances of array index as `key`** — causes stale UI on list reorder/filter
- **35 buttons without explicit `type`** — form submission bugs
- **8 hooks with missing `client.get` dependency** — stale closure bugs

---

## Correctness (Runtime Bugs)

### 1. Array Index as Key — `key={i}` / `key={idx}`

**Why it matters:** React uses `key` to track which DOM nodes correspond to which data items. When a list is reordered or filtered, index-based keys cause React to update the wrong DOM nodes — leading to stale content, broken state, and hard-to-reproduce UI bugs.

**19 instances across 17 files:**

| File | Lines |
|------|-------|
| `app/for-businesses/page.tsx` | 219 |
| `components/onboarding/OnboardingSidebar.tsx` | 46 |
| `app/products/page.tsx` | 282 |
| `app/become-expert/page.tsx` | 71 |
| `app/for-experts/page.tsx` | 135 |
| `app/product/[id]/page.tsx` | 286 |
| `components/agent/ProployResearchPanel.tsx` | 64 |
| `app/(auth)/forgot-password/page.tsx` | 46, 52 |
| `app/(auth)/reset-password-email/page.tsx` | 59, 65, 93 |
| `components/product/ProductInformationTab.tsx` | 176 |
| `components/product/ReviewsTab.tsx` | 25, 69 |
| `components/ui/ProgressSteps.tsx` | 34 |
| `components/vendor-onboarding/PortfolioStep.tsx` | 142 |
| `components/product/PricingTab.tsx` | 91 |
| `app/(auth)/verify-email/page.tsx` | 59, 65, 93 |
| `app/(auth)/password-reset-confirmation/page.tsx` | 43, 49 |
| `app/(auth)/email-verified/page.tsx` | 43, 49 |
| `app/(auth)/set-new-password/page.tsx` | 68, 74 |
| `app/(auth)/check-email/page.tsx` | 31, 37 |

**Fix:** Replace `key={i}` with a stable, data-derived identifier:
```tsx
// Bad — breaks when list reorders
items.map((item, i) => <div key={i}>...</div>)

// Good — stable identity
items.map((item) => <div key={item.id}>...</div>)
```

When no natural `id` exists, derive a composite key:
```tsx
key={\`${item.email}:${item.role}\`}
```

---

### 2. Buttons Without Explicit `type` Attribute

**Why it matters:** `<button>` defaults to `type="submit"` in browsers. Unlabeled buttons inside forms accidentally submit the form when clicked.

**35 instances** across the codebase.

**Fix:** Always annotate every `<button>` explicitly:
```tsx
<button type="button" onClick={handleClose}>Close</button>
<button type="submit">Save</button>
```

---

### 3. Missing `useCallback` Dependencies (`exhaustive-deps`)

**Why it matters:** Stale closure bugs — callbacks read outdated state or use old versions of functions.

**8 instances in hooks:**

| File | Line | Missing |
|------|------|---------|
| `hooks/use-admin-experts.ts` | 76 | `client.get` |
| `hooks/use-catalog-search.ts` | 66 | `client.get` |
| `hooks/use-catalog-products.ts` | 84 | `client.get` |
| `hooks/use-catalog-categories.ts` | 45 | `client.get` |
| `hooks/use-product-detail.ts` | 124, 134, 142, 152 | `client.get` |

**Fix:** Add `client.get` to deps or add `eslint-disable-line react-hooks/exhaustive-deps` with a reason.

---

## Security

### 4. `target="_blank"` Without `rel="noreferrer"`

**Why it matters:** Opened pages can navigate the original page via `window.opener.location`. Confirmed security vulnerability.

**6 vulnerable instances — SECURITY PRIORITY:**

| File | Line |
|------|------|
| `components/Footer.tsx` | 88 |
| `components/product/ProductInformationTab.tsx` | 81 |
| `app/experts/[id]/page.tsx` | 189, 200, 224, 268 |
| `app/experts/dashboard/page.tsx` | 647 |
| `app/admin/experts/[id]/page.tsx` | 238, 253 |

**Fix:**
```tsx
<a href="..." target="_blank" rel="noopener noreferrer">Link</a>
```

---

### 5. `dangerouslySetInnerHTML` Usage

**3 instances:** `app/for-experts/page.tsx` lines 184, 213, 297 — rendering hardcoded marketing copy (`m.body`, `v.body`, `faq.a`).

**Current risk:** Low — all content is hardcoded strings. However, the pattern is dangerous if a future refactor passes API data through this path.

**Fix:** Replace with direct text rendering:
```tsx
// Preferred — plain text
<p>{m.body}</p>
```

---

## Accessibility (WCAG)

### 6. Controls Without Associated Labels — 51 instances

Interactive controls without accessible labels fail WCAG 1.3.1. Screen readers cannot announce what the control is for.

### 7. Labels Without Associated Controls — 16 instances

`<label>` without `htmlFor` or nested control is ignored by screen readers.

---

## React-Specific Issues

### 8. Click Handlers Missing Keyboard Equivalents — 7 instances

| File |
|------|
| `TextAreaField.tsx:79` |
| `InputField.tsx:85` |
| `PreferencesStep.tsx:116, 217` |
| `Select.tsx:134` |

### 9. Static Elements with Event Handlers — 7 instances

`<div>` or `<span>` with `onClick` should be `<button>`. If `<div>` is necessary, add an ARIA role.

### 10. Async/Await in GET Handlers

`app/auth/callback/route.ts` — accepted exception. Supabase OAuth browser redirect makes CSRF exploitation impossible.

---

## Design / Polish (Non-Critical)

| Category | Count |
|----------|-------|
| Redundant `w-N h-N` → `size-N` | 61 |
| Em dashes (—) in JSX text | 18 |
| Bold headings (font-weight 700+) | 12 |
| React Compiler destructure | 27 |

---

## Priority Summary

| Priority | Issue | Count |
|----------|-------|-------|
| **P0 — Security** | `target="_blank"` missing `rel="noreferrer"` | 6 |
| **P0 — Security** | `dangerouslySetInnerHTML` | 3 (low risk currently) |
| **P1 — Correctness** | Array index `key` | 19 |
| **P1 — Correctness** | Button `type` attribute | 35 |
| **P1 — Correctness** | `exhaustive-deps` in hooks | 8 |
| **P2 — Accessibility** | Missing labels | 67 |
| **P2 — Accessibility** | Keyboard handlers | 7 |
| **P3 — Design** | Redundant size, em dashes, bold headings | ~100 |

---

## Guidance for Frontend Team

### 1. Array keys — always use stable IDs
Never use array index as key. Derive one if needed: `key={\`${item.email}:${item.platform}\`}`

### 2. Every button needs a `type`
Add `type="button"` to all non-submit buttons. Make it a code review checklist item.

### 3. External links need `rel="noopener noreferrer"`
Never write `target="_blank"` without `rel="noopener noreferrer"`.

### 4. Labels must reference controls
Every `<label>` needs `htmlFor` or a nested control. Every control needs a label.

### 5. Use semantic elements
- Clickable `<div>` → `<button>`
- Keyboard interactions via `onKeyDown`, not just `onClick`

### 6. Hooks with `client.get`
Include `client.get` in `useCallback` dependency array, or add `eslint-disable-line` with a reason.

### 7. Avoid `dangerouslySetInnerHTML`
Render text content directly: `<p>{text}</p>`. If you must render HTML from a trusted source, use `DOMPurify`.

### 8. Run react-doctor before committing
```bash
npx react-doctor .
```
P0 and P1 issues should be fixed before merge; P2 can be tracked in backlog.

---

*Report generated from react-doctor v0.2.3 scan. Run `npx react-doctor . --verbose` for the full issue list with line numbers.*