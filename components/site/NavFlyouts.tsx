'use client'

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Hover flyouts for the Products and Experts tabs in the v2 Nav: a one-line
// orientation plus the two most useful next clicks, in the same visual
// language as the "About us" dropdown. Purely static — no data fetching.

const PANEL =
  "flex w-[260px] flex-col gap-3 rounded-xl border border-border bg-white p-5 shadow-[0_24px_48px_-16px_rgba(10,13,18,0.18)]";
const PRIMARY_LINK =
  "group/l inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-ink transition-colors hover:text-cobalt";

function ArrowLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className={PRIMARY_LINK}>
      {children}
      <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 group-hover/l:translate-x-0.5" />
    </Link>
  );
}

export function ProductsFlyout() {
  return (
    <div className={PANEL} data-testid="products-flyout">
      <span className="label">Explore products</span>
      <p className="text-[0.85rem] leading-relaxed text-ink-soft">
        Curated B2B software, scored on fit for your team, with vetted implementers attached.
      </p>
      <div className="flex flex-col gap-2 pt-1">
        <ArrowLink href="/products">All products</ArrowLink>
        <ArrowLink href="/compare">Compare products</ArrowLink>
      </div>
    </div>
  );
}

export function ExpertsFlyout() {
  return (
    <div className={PANEL} data-testid="experts-flyout">
      <span className="label">Explore experts</span>
      <p className="text-[0.85rem] leading-relaxed text-ink-soft">
        Vetted implementation specialists who have shipped the platforms you are evaluating.
      </p>
      <div className="flex flex-col gap-2 pt-1">
        <ArrowLink href="/experts">All experts</ArrowLink>
        <ArrowLink href="/for-experts">Become an expert</ArrowLink>
      </div>
    </div>
  );
}
