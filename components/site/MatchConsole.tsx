'use client'

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { detectSearchMode } from "@/features/catalog";
import { useAuth } from "@/components/providers/auth-provider";
import { isExpertRole } from "@/lib/auth/roles";
import { ProductSearch } from "@/components/search/ProductSearch";
import { MATCH_CONSOLE_HASH } from "./match-console-hash";

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
 * The one landing search: a single bar, with the results panel expanding
 * directly beneath it once there is a real query.
 *
 * There is no keyword/natural toggle. `detectSearchMode` reads the mode off
 * the query itself, so a name goes to the fast keyword typeahead and a
 * described need goes to the natural endpoint without the visitor having to
 * know the difference. `data-mode` tints the results panel so the switch is
 * still visible after the fact.
 */
export function MatchConsole() {
  const { user } = useAuth();
  const isExpert = isExpertRole(user?.role);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const hoveredRef = useRef(false);

  const mode = detectSearchMode(query);

  // Arriving on `/#match-engine` (the nav's "Search products" link) should put
  // the caret in the field, not just scroll the bar into view. `hashchange`
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
      className="mc-card"
    >
      {/* `embedded` puts the results in normal flow, so the panel expands the
          page rather than floating over it. ProductSearch owns the bar, the
          results and the "View all results" link into /products. */}
      <ProductSearch
        query={query}
        onQueryChange={setQuery}
        inputRef={inputRef}
        mode={mode}
        variant="embedded"
        listClassName="mc-results"
      />

      {/* Sam is the guided route: for buyers who don't yet know what to search
          for, the workspace runs the discovery questions and builds the shortlist.
          Experts cannot use Sam, so they are not offered the way in. */}
      {!isExpert && (
        <p className="pp-small mc-sam-line">
          Not sure what to search?{" "}
          <Link href="/AI_workspace" className="mc-sam">
            Ask Sam →
          </Link>
        </p>
      )}
    </div>
  );
}
