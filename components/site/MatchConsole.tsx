'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { SearchMode } from "@/features/catalog";
import { SearchModeToggle } from "@/components/search/SearchModeToggle";
import { useAuth } from "@/components/providers/auth-provider";
import { isExpertRole } from "@/lib/auth/roles";
import { ProductSearch } from "@/components/search/ProductSearch";
import { MATCH_CONSOLE_HASH } from "./match-console-hash";

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

/** See `.mc-min-h` in v2-pages.css — reserves the suggestion block's footprint. */
const BODY_MIN_H = "mc-min-h";

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

  // Arriving on `/#match-engine` (the nav's "Search products" link) should put
  // the caret in the field, not just scroll the card into view. `hashchange`
  // covers the case where the visitor is already on the homepage, since Next
  // updates the hash without remounting this component.
  useEffect(() => {
    const focusIfTargeted = () => {
      if (window.location.hash !== `#${MATCH_CONSOLE_HASH}`) return;
      inputRef.current?.focus();
    };
    focusIfTargeted();
    window.addEventListener("hashchange", focusIfTargeted);
    return () => window.removeEventListener("hashchange", focusIfTargeted);
  }, []);

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
      id={MATCH_CONSOLE_HASH}
      data-mode={mode}
      onPointerEnter={() => {
        hoveredRef.current = true;
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
      }}
      className="pp-glass mc-card"
    >
      <div className="mc-row mc-row--head">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
        <span className="pp-label">Proploy match engine</span>
        <span className="ml-auto">
          <SearchModeToggle value={mode} onChange={setMode} variant="card" />
        </span>
      </div>

      <div className="mc-body">
        <p className="pp-label mc-hint" aria-live="polite">
          {isNatural ? NATURAL_HINT : KEYWORD_HINT}
        </p>
        <div className="mc-search">
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
        <div className="mc-row mc-row--sam">
          <p className="pp-small">
            Not sure what to search? Sam asks a few questions and shortlists for you.
          </p>
          <Link href="/AI_workspace" className="mc-sam">
            Ask Sam →
          </Link>
        </div>
      )}

      {/* Only rendered once there is something to link to — with no query the
          card ends on the search body rather than an empty bordered strip. */}
      {hasQuery && (
        <div className="mc-row mc-row--foot">
          <span className="pp-label">Top rated matches</span>
          <Link
            href={`/products?search=${encodeURIComponent(trimmed)}${isNatural ? "&mode=natural" : ""}`}
            className="pp-label mc-viewall"
          >
            View all →
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Empty live state ─────────────────────────────────────────────────────────

function Suggestions({ onPick }: { onPick: (suggestion: string) => void }) {
  return (
    <div className="mc-suggest">
      <p className="pp-label">Start typing — or try one</p>
      <div className="mc-suggest-list">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className="mc-suggestion"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}