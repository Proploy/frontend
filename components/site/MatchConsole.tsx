'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { SearchMode } from "@/features/catalog";
import { SearchModeToggle } from "@/components/search/SearchModeToggle";
import { useAuth } from "@/components/providers/auth-provider";
import { isExpertRole } from "@/lib/auth/roles";
import { ProductSearch } from "@/components/search/ProductSearch";

const SUGGESTIONS = [
  "Procurement suite for a 400-person manufacturer",
  "HRIS that integrates with NetSuite",
  "Field service platform with offline mode",
  "Revenue ops stack for a Series B SaaS",
];

/** Live search fires from 2 characters, like the rest of the catalog surfaces. */
export const MIN_QUERY_LENGTH = 2;

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

/**
 * Reserves the suggestion block's footprint — three 8rem rows, two 0.5rem gaps
 * and the 1rem padding either side — so swapping suggestions for results never
 * resizes the card under the pointer.
 */
const BODY_MIN_H = "min-h-[14rem]";

const KEYWORD_HINT = "Exact product, vendor or category names";
const NATURAL_HINT = "Ask in plain language — we match the best software";

/**
 * The one landing search. The hosted ProductSearch bar is always visible with
 * suggestion chips until a real query exists; the mode toggle sits in the card
 * header so visitors pick keyword vs natural-language up front.
 */
export function MatchConsole() {
  const { user } = useAuth();
  const isExpert = isExpertRole(user?.role);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("keyword");

  const inputRef = useRef<HTMLInputElement>(null);
  const hoveredRef = useRef(false);

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= MIN_QUERY_LENGTH;
  const isNatural = mode === "natural";

  // Type-through: keystrokes while hovered flow into the field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!hoveredRef.current) return;
      if (document.activeElement === inputRef.current) return;
      if (!isTypeThroughKey(event.key, event)) return;
      event.preventDefault();
      setQuery((prev) => prev + event.key);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      className="glass-card relative overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-500 data-[mode=natural]:border-[color-mix(in_oklab,var(--cobalt)_38%,var(--line))] data-[mode=natural]:shadow-[0_34px_80px_-40px_color-mix(in_oklab,var(--cobalt)_60%,transparent)]"
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
        <span className="label">Proploy match engine</span>
        <span className="ml-auto">
          <SearchModeToggle value={mode} onChange={setMode} variant="card" />
        </span>
      </div>

      <div className="px-4 pt-3">
        <p className="label !tracking-[0.05em]" aria-live="polite">
          {isNatural ? NATURAL_HINT : KEYWORD_HINT}
        </p>
        <div className="mt-2.5">
          <ProductSearch
            query={query}
            onQueryChange={setQuery}
            inputRef={inputRef}
            mode={mode}
            variant="embedded"
            listClassName={BODY_MIN_H}
          />
        </div>
        {!hasQuery && (
          <div className={BODY_MIN_H}>
            <Suggestions
              onPick={(suggestion) => {
                setQuery(suggestion);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}
      </div>

      {/* Sam is the guided route: for buyers who don't yet know what to search
          for, the workspace runs the discovery questions and builds the shortlist.
          Experts cannot use Sam, so they are not offered the way in. */}
      {!isExpert && (
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
        <p className="label !normal-case !tracking-normal text-[0.72rem]">
          Not sure what to search? Sam asks a few questions and shortlists for you.
        </p>
        <Link
          href="/AI_workspace"
          className="shrink-0 rounded-full border border-border bg-white/70 px-2.5 py-1 text-[0.72rem] font-medium text-cobalt-deep transition-colors hover:border-cobalt/50 hover:bg-cobalt-soft/40"
        >
          Ask Sam →
        </Link>
      </div>
      )}

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        {hasQuery ? (
          <>
            <span className="label">Top rated matches</span>
            <Link
              href={`/products?search=${encodeURIComponent(trimmed)}${isNatural ? "&mode=natural" : ""}`}
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
    <div className="flex flex-col justify-center py-4">
      <p className="label mb-2.5">Start typing — or try one</p>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((suggestion) => (
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