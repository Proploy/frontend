# Proploy Marketing Kit — page contract

Shared section components for every page under `app/(marketing)/`. Built by lifting the
patterns already in `app/for-businesses` and `app/for-experts` so all marketing pages share one
visual language. **Agents building pages MUST use these components and must not edit
`Footer`, `Navbar`, `globals.css`, or any file in this folder.**

## Page contract (canonical section order for a feature page)

```
MarketingHero            ← eyebrow? + display title + subtitle + CTA pair (+ optional UISnippetFrame visual)
LogoMarquee              ← optional social proof strip
ThreeUpCards             ← 3 sub-features of the capability
StackedFeatureBlock ×2–3 ← alternate imagePosition; each visual = a UISnippetFrame product mock
MetricStat               ← optional outcome stats band
TestimonialWall          ← buyer/expert quotes
FAQAccordion             ← 5–7 Q&A (contact card optional)
CTABanner                ← closing CTA (variant="dark" for high emphasis)
```

`(marketing)/layout.tsx` already supplies the top offset, DM Sans family, and the `Footer`.
A page renders only its sections — never its own `<Footer/>` or page wrapper.

## Components (import from `@/components/marketing`)

| Component | Use |
|---|---|
| `MarketingHero` | Page hero. Pass `primary`/`secondary` CTAs; put a `UISnippetFrame` in `children`. |
| `UISnippetFrame` | "Real product UI in a frame." Wrap an internal-app mock/snippet. `chrome`, `title` props. |
| `ThreeUpCards` | Row of 2–4 `FeatureCard`s (icon tile + title + body + optional link). |
| `StackedFeatureBlock` | Alternating text/visual block. `visual` slot + `imagePosition` + `bullets` + `tint`. |
| `MetricStat` | Stat band (`Metric[]`). |
| `TestimonialWall` | Masonry quote grid (`Testimonial[]`). |
| `FAQAccordion` | Single-open FAQ (`FaqItem[]`) + optional `contact` card. |
| `CTABanner` | Closing CTA. `variant: 'default' | 'dark'`. |
| `LogoMarquee` | Wordmark marquee (reduced-motion safe). |
| `SectionHeading`, `Container`, `CtaButtons`, `btnPrimary`, `btnSecondary` | Primitives for custom sections. |

## Style guardrails (non-negotiable)

- **Tokens only.** Brand `#155eef` (hover `#004eeb`), ink `#181d27`, body `#535862`, muted
  `#717680`, border `#e9eaeb`/`#d5d7da`, surface tint `#fafafa`. DM Sans display + body; Inter
  for nav/labels. Reuse `globals.css` `display-*` / `text-*-*` utilities where convenient.
- **Body contrast ≥ 4.5:1.** `#535862`/`#252b37` on white/`#fafafa` passes; do not drop body
  text to `#a4a7ae` or lighter.
- **No eyebrow on every section.** `eyebrow` is optional and rare — at most one or two per page.
- **No numbered section markers (01/02/03)** unless the section is a genuine ordered sequence.
- **No gradient text.** Do not use `.text-gradient-blue` (slop ban). Emphasis via weight/size.
- **No side-stripe borders, no nested cards, no identical card grids repeated** down the page.
- **Headings:** `text-wrap: balance`; test copy at 390 / 768 / 1440 px — no overflow.
- **Motion:** any Framer/CSS reveal needs a `prefers-reduced-motion` alternative; content is
  visible by default (never gated behind a class-triggered transition).
- **Copy register:** credible, sharp, trust-first. Translate Contra's creative-freelance
  framing to software implementation (experts/vendors, businesses, consulting firms).

## Internal snippets

Feature pages embed a real internal-app mock. Build/keep those mocks under the internal app
(e.g. `app/experts/dashboard/contracts`) on seed data, then reproduce the key surface inside a
`UISnippetFrame` on the marketing page. Keep the marketing mock self-contained (no live data
fetch) so pages stay static and fast.
