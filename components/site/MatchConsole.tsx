'use client'

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CatalogImage } from "@/components/catalog/CatalogImage";
import { getProductDetailHref, useProductList } from "@/features/catalog";
import type { CardProduct } from "@/features/catalog";

const QUERIES = [
  "Procurement suite for a 400-person manufacturer",
  "HRIS that integrates with NetSuite",
  "Field service platform with offline mode",
  "Revenue ops stack for a Series B SaaS",
];

const MATCHES = [
  { name: "Vantiq Procure", fit: 96, tag: "Procurement", note: "Pre-negotiated · −22% list" },
  { name: "Northlake ERP", fit: 91, tag: "Finance", note: "3 vetted implementers" },
  { name: "Cadence Ops", fit: 87, tag: "Operations", note: "6-week deploy plan" },
];

/** Live search fires from 2 characters, like the rest of the catalog surfaces. */
export const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 220;
const LIVE_RESULT_COUNT = 3;

/**
 * Every swappable body state reserves the demo reel's footprint — three 8rem
 * rows, two 0.5rem gaps and the 1rem padding either side — so activating the
 * console never resizes the card under the pointer.
 */
const BODY_MIN_H = "min-h-[27rem]";

/** Ratings are 0–5; the match bar reads one as a share of the track. */
export function ratingToBarWidth(rating: number | null): number {
  if (rating === null || Number.isNaN(rating)) return 0;
  return Math.max(0, Math.min(100, (rating / 5) * 100));
}

/**
 * Secondary line for a live result — real catalog signal only. The vendor is
 * skipped when it just restates the product name (Odoo / Odoo S.A.).
 */
export function resultNote(product: CardProduct): string {
  if (product.product_description) return product.product_description;

  const parts: string[] = [];
  if (product.vendor_name && !restatesName(product.vendor_name, product.product_name)) {
    parts.push(product.vendor_name);
  }
  if (product.free_trial_available) parts.push("Free trial");
  else if (product.free_plan_available) parts.push("Free plan");
  if (product.reviews) parts.push(`${product.reviews.toLocaleString()} reviews`);

  return parts.join(" · ") || "Vetted implementers available";
}

function restatesName(vendor: string, product: string) {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const a = normalize(vendor);
  const b = normalize(product);
  return a === b || a.startsWith(b) || b.startsWith(a);
}

/**
 * A bare printable keystroke typed while the console is hovered should land in
 * the search field, so "hover, then type" works without the card grabbing focus
 * off the page (which would hijack space/arrow scrolling).
 */
export function isTypeThroughKey(
  key: string,
  modifiers: { ctrlKey: boolean; metaKey: boolean; altKey: boolean },
): boolean {
  if (modifiers.ctrlKey || modifiers.metaKey || modifiers.altKey) return false;
  return key.length === 1 && key !== " ";
}

export function MatchConsole() {
  const [live, setLive] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoveredRef = useRef(false);

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= MIN_QUERY_LENGTH;

  // ── Demo reel — runs only while idle ───────────────────────────────────────
  useEffect(() => {
    if (live) return;
    const full = QUERIES[qIndex];
    let i = 0;
    setTyped("");
    setRevealed(0);
    const type = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(type);
        [0, 1, 2].forEach((n) =>
          setTimeout(() => setRevealed(n + 1), 420 + n * 380),
        );
        setTimeout(() => setQIndex((v) => (v + 1) % QUERIES.length), 5200);
      }
    }, 34);
    return () => clearInterval(type);
  }, [qIndex, live]);

  // ── Debounce keystrokes before they reach the catalog ──────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [trimmed]);

  const activate = useCallback(() => setLive(true), []);

  /** Empties the field but keeps the console live — the visitor is still here. */
  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  /** Hands the card back to the idle demo reel. */
  const exitLive = useCallback(() => {
    setQuery("");
    setLive(false);
    inputRef.current?.blur();
  }, []);

  const handlePointerLeave = useCallback(() => {
    hoveredRef.current = false;
  }, []);

  /**
   * Rewinding to the demo is driven by where the pointer actually is, not by a
   * pointerleave event: activating swaps the card's children, and React can
   * swallow the synthetic leave that follows. Only armed while the console is
   * live and empty — once something is typed, the visitor keeps their results.
   */
  useEffect(() => {
    if (!live || query) return;

    const onPointerMove = (event: PointerEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      hoveredRef.current = inside;
      if (inside) return;
      if (card.contains(document.activeElement)) return;
      setLive(false);
    };

    document.addEventListener("pointermove", onPointerMove);
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, [live, query]);

  // Type-through: keystrokes while hovered flow into the field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hoveredRef.current) return;
      if (document.activeElement === inputRef.current) return;
      if (!isTypeThroughKey(event.key, event)) return;
      event.preventDefault();
      setLive(true);
      setQuery((prev) => prev + event.key);
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    exitLive();
  };

  const showLiveFooter = live && hasQuery;

  return (
    <div
      ref={cardRef}
      onPointerEnter={() => {
        hoveredRef.current = true;
        activate();
      }}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={activate}
      data-live={live}
      className="glass-card relative overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-500 data-[live=true]:border-[color-mix(in_oklab,var(--cobalt)_38%,var(--line))] data-[live=true]:shadow-[0_34px_80px_-40px_color-mix(in_oklab,var(--cobalt)_60%,transparent)]"
    >
      {/* scan beam — idle only */}
      {!live && (
        <div
          aria-hidden
          className="scan pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--cobalt)_10%,transparent),transparent)]"
        />
      )}

      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className={`h-1.5 w-1.5 rounded-full bg-cobalt ${live ? "" : "pulse-dot"}`} />
        <span className="label">Proploy match engine</span>
        <span className="label ml-auto">{live ? "search live" : "live"}</span>
      </div>

      <div className="px-4 pt-4">
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3 transition-colors duration-300 focus-within:border-[color-mix(in_oklab,var(--cobalt)_45%,var(--line))]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-cobalt" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>

          {live ? (
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search real software — try “CRM” or “payroll”"
              aria-label="Search software products"
              className="w-full min-w-0 bg-transparent font-mono text-[0.78rem] text-ink outline-none placeholder:text-ink-soft/60"
            />
          ) : (
            <p className="truncate font-mono text-[0.78rem] text-ink">
              {typed}
              <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-cobalt align-middle" />
            </p>
          )}

          {live && query.length > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                clearQuery();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-md px-1 text-ink-soft transition-colors hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {live ? (
        hasQuery ? (
          <LiveResults
            query={debouncedQuery.length >= MIN_QUERY_LENGTH ? debouncedQuery : trimmed}
          />
        ) : (
          <Suggestions
            onPick={(suggestion) => {
              setQuery(suggestion);
              inputRef.current?.focus();
            }}
          />
        )
      ) : (
        <ul className={`space-y-2 p-4 ${BODY_MIN_H}`}>
          {MATCHES.map((m, i) => (
            <li
              key={m.name}
              className="rounded-xl border border-border bg-white/70 p-3.5 transition-all duration-700"
              style={{
                opacity: revealed > i ? 1 : 0,
                transform: revealed > i ? "none" : "translateY(10px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-cobalt-soft font-display text-[0.8rem] font-semibold text-cobalt-deep">
                  {m.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.85rem] font-medium text-ink">{m.name}</p>
                  <p className="label mt-0.5 !tracking-[0.1em]">{m.tag}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-mono text-[0.8rem] font-semibold text-cobalt-deep">{m.fit}%</p>
                  <p className="label !text-[0.6rem]">fit</p>
                </div>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-deep">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--cobalt-deep),var(--cobalt))] transition-[width] duration-1000 ease-out"
                  style={{ width: revealed > i ? `${m.fit}%` : "0%" }}
                />
              </div>
              <p className="mt-2 text-[0.75rem] text-ink-soft">{m.note}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        {showLiveFooter ? (
          <>
            <span className="label">Top rated matches</span>
            <Link
              href={`/products?search=${encodeURIComponent(trimmed)}`}
              className="label !tracking-[0.12em] text-cobalt-deep transition-opacity hover:opacity-70"
            >
              View all →
            </Link>
          </>
        ) : (
          <>
            <span className="label">Vetted experts attached</span>
            <div className="flex -space-x-2">
              {["A", "M", "R", "K"].map((c) => (
                <span
                  key={c}
                  className="grid h-6 w-6 place-items-center rounded-full border border-white bg-ink text-[0.6rem] font-medium text-paper"
                >
                  {c}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Empty live state ─────────────────────────────────────────────────────────

function Suggestions({ onPick }: { onPick: (suggestion: string) => void }) {
  return (
    <div className={`flex flex-col justify-center p-4 ${BODY_MIN_H}`}>
      <p className="label mb-2.5">Start typing — or try one</p>
      <div className="flex flex-wrap gap-1.5">
        {QUERIES.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="rounded-lg border border-border bg-white/70 px-2.5 py-1.5 text-left text-[0.72rem] text-ink-soft transition-colors hover:border-[color-mix(in_oklab,var(--cobalt)_40%,var(--line))] hover:text-ink"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Live result list ─────────────────────────────────────────────────────────

/**
 * Mounted only once there is a real query, so an idle hero never calls the
 * catalog. Top-rated ordering keeps the match bars descending like the reel.
 */
function LiveResults({ query }: { query: string }) {
  const { products, loading, error } = useProductList({
    search: query,
    sort: "rating",
    limit: LIVE_RESULT_COUNT,
  });

  if (loading && products.length === 0) {
    return (
      <ul className={`space-y-2 p-4 ${BODY_MIN_H}`}>
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-32 animate-pulse rounded-xl border border-border bg-white/50"
            style={{ animationDelay: `${i * 90}ms` }}
          />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col justify-center p-4 ${BODY_MIN_H}`}>
        <p className="rounded-xl border border-border bg-white/70 p-3.5 text-[0.78rem] text-ink-soft">
          Search is unavailable right now. Try again in a moment.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col justify-center p-4 ${BODY_MIN_H}`}>
        <p className="rounded-xl border border-border bg-white/70 p-3.5 text-[0.78rem] text-ink-soft">
          No products match “{query}”. Try a broader term — or{" "}
          <Link href="/experts" className="text-cobalt-deep underline underline-offset-2">
            ask a vetted expert
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <ul
      key={query}
      className={`space-y-2 p-4 ${BODY_MIN_H}`}
      style={{ opacity: loading ? 0.55 : 1, transition: "opacity .2s" }}
    >
      {products.slice(0, LIVE_RESULT_COUNT).map((product, i) => (
        <li key={product.product_id}>
          <Link
            href={getProductDetailHref(product.product_id)}
            className="block rounded-xl border border-border bg-white/70 p-3.5 transition-colors duration-300 hover:border-[color-mix(in_oklab,var(--cobalt)_45%,var(--line))] hover:bg-white"
            style={{
              animation: "fade-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
              animationDelay: `${i * 70}ms`,
            }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-cobalt-soft font-display text-[0.8rem] font-semibold text-cobalt-deep">
                {product.product_logo ? (
                  <CatalogImage
                    src={product.product_logo}
                    alt=""
                    className="h-full w-full object-contain p-1"
                    fallback={<span>{product.product_name.charAt(0)}</span>}
                  />
                ) : (
                  <span>{product.product_name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[0.85rem] font-medium text-ink">
                  {product.product_name}
                </p>
                <p className="label mt-0.5 truncate !tracking-[0.1em]">
                  {product.primary_category ?? "Software"}
                </p>
              </div>
              <div className="ml-auto shrink-0 text-right">
                <p className="font-mono text-[0.8rem] font-semibold text-cobalt-deep">
                  {product.rating !== null ? product.rating.toFixed(1) : "—"}
                </p>
                <p className="label !text-[0.6rem]">{product.rating !== null ? "rating" : "new"}</p>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper-deep">
              <div
                className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--cobalt-deep),var(--cobalt))]"
                style={{
                  width: `${ratingToBarWidth(product.rating)}%`,
                  animation: "bar-fill 0.9s cubic-bezier(0.22,1,0.36,1) both",
                  animationDelay: `${i * 70 + 120}ms`,
                }}
              />
            </div>
            <p className="mt-2 truncate text-[0.75rem] text-ink-soft">{resultNote(product)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
