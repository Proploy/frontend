'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import {
  getProductDetailHref,
  useKeywordSearch,
  useNaturalSearch,
} from "@/features/catalog";
import type { SearchMode } from "@/features/catalog";

/**
 * The real catalog search: keyword typeahead (spell correction + ghost
 * completion) or natural-language search, driven by the caller's mode state.
 *
 * Controlled so a shell (e.g. the match engine card) can own the query, keep
 * its footer in sync, and feed keystrokes to the input. Two variants:
 * - `popover` renders the classic dropdown below the bar (hero style).
 * - `embedded` renders results inline in normal flow (card style).
 */
export function ProductSearch({
  query,
  onQueryChange,
  inputRef,
  mode,
  variant = "popover",
  className = "",
  listClassName = "",
}: {
  query: string
  onQueryChange: (query: string) => void
  inputRef?: React.Ref<HTMLInputElement>
  mode: SearchMode
  variant?: "popover" | "embedded"
  className?: string
  listClassName?: string
}) {
  const router = useRouter();
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLDivElement>(null);

  const {
    products,
    loading,
    error,
    suggestedCorrection,
    ghostSuffix,
    fullCompletion,
    search,
    clear,
  } = useKeywordSearch();

  const {
    products: naturalProducts,
    loading: naturalLoading,
    error: naturalError,
    note: naturalNote,
    search: searchNatural,
    clear: clearNatural,
  } = useNaturalSearch();

  const isNatural = mode === "natural";

  const displayedProducts = isNatural ? naturalProducts : products;
  const displayedLoading = isNatural ? naturalLoading : loading;
  const displayedError = isNatural ? naturalError : error;

  const embedded = variant === "embedded";
  const hasQuery = query.trim().length > 1;
  /** The dropdown is gated on focus in popover mode; embedded always shows. */
  const showResults = embedded ? hasQuery : resultsOpen && hasQuery;

  React.useEffect(() => {
    if (hasQuery) {
      if (isNatural) {
        void searchNatural(query, 6);
      } else {
        void search(query, 6);
      }
    } else {
      clear();
      clearNatural();
    }
    setSelectedIndex(-1);
  }, [clear, clearNatural, hasQuery, isNatural, query, search, searchNatural]);

  React.useEffect(() => {
    if (embedded) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [embedded]);

  const handleSubmit = (targetQuery?: string) => {
    const value = (targetQuery ?? query).trim();
    if (!value) return;
    setResultsOpen(false);
    router.push(
      `/products?search=${encodeURIComponent(value)}${mode === "natural" ? "&mode=natural" : ""}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode === "keyword" && (e.key === "Tab" || e.key === "ArrowRight")) {
      if (
        ghostSuffix &&
        fullCompletion &&
        typeof inputRef === "object" &&
        inputRef !== null &&
        inputRef.current?.selectionStart === query.length
      ) {
        e.preventDefault();
        onQueryChange(fullCompletion);
        return;
      }
    }

    if (!showResults || displayedProducts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < displayedProducts.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : displayedProducts.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedProduct = displayedProducts[selectedIndex];
      if (selectedProduct) {
        setResultsOpen(false);
        router.push(getProductDetailHref(selectedProduct.product_id));
      }
    } else if (e.key === "Escape" && !embedded) {
      setResultsOpen(false);
    }
  };

  const applyCorrection = (correction: string) => {
    if (isNatural) return;
    onQueryChange(correction);
    void search(correction, 6);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedIndex >= 0 && displayedProducts[selectedIndex]) {
            router.push(getProductDetailHref(displayedProducts[selectedIndex].product_id));
            setResultsOpen(false);
          } else {
            handleSubmit();
          }
        }}
        className="flex items-center rounded-2xl border border-border bg-white px-1 py-1 shadow-[0_24px_60px_-46px_color-mix(in_oklab,var(--cobalt)_80%,transparent)]"
      >
        <label htmlFor="product-search-q" className="sr-only">
          What are you trying to solve?
        </label>
        <div className="relative flex flex-1 items-center min-w-0">
          {mode === "keyword" && ghostSuffix && query.length > 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-2.5 z-0 select-none text-[0.9375rem] whitespace-pre text-ink-soft/40"
            >
              <span className="opacity-0">{query}</span>
              <span>{ghostSuffix}</span>
            </div>
          )}
          <input
            ref={inputRef}
            id="product-search-q"
            type="text"
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              if (!embedded && e.target.value.trim().length > 1) setResultsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 1) setResultsOpen(true);
            }}
            placeholder="What are you trying to solve?"
            className="relative z-10 w-full min-w-0 bg-transparent px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-soft/70"
          />
        </div>
      </form>

      {showResults && (
        <div
          className={
            embedded
              ? listClassName
              : "absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-[380px] overflow-y-auto rounded-2xl border border-border bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)]"
          }
        >
          {isNatural && naturalNote && (
            <p className="border-b border-border bg-[#f6f8fb] px-4 py-2 text-[0.75rem] text-ink-soft">
              {naturalNote}
            </p>
          )}

          {mode === "keyword" && suggestedCorrection && (
            <div className="flex items-center justify-between border-b border-border bg-[#eff4ff] px-4 py-2.5">
              <p className="text-[0.8125rem] text-[#155eef]">
                Did you mean:{" "}
                <button
                  type="button"
                  onClick={() => applyCorrection(suggestedCorrection.suggestion)}
                  className="font-bold text-[#004eeb] underline hover:text-[#0038a8]"
                >
                  {suggestedCorrection.suggestion}
                </button>?
              </p>
              <span className="text-[0.7rem] font-medium tracking-wide uppercase text-[#2e90fa]">Typo detected</span>
            </div>
          )}

          {displayedLoading ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-ink-soft">Searching products…</p>
          ) : displayedError ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-red-600">Unable to search products.</p>
          ) : displayedProducts.length > 0 ? (
            <div className="py-1.5">
              {displayedProducts.map((product, idx) => (
                <Link
                  key={product.product_id}
                  href={getProductDetailHref(product.product_id)}
                  onClick={() => {
                    setResultsOpen(false);
                    if (!embedded) setResultsOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    idx === selectedIndex ? "bg-cobalt-soft/60" : "hover:bg-cobalt-soft/40"
                  }`}
                >
                  <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white text-[0.85rem] font-semibold text-cobalt-deep">
                    {product.product_logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.product_logo} alt="" className="size-full object-contain p-1" />
                    ) : (
                      product.product_name.charAt(0)
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.875rem] font-medium text-ink">{product.product_name}</span>
                    <span className="block truncate text-[0.75rem] text-ink-soft">
                      {product.primary_category ?? "Software product"}
                    </span>
                  </span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="w-full border-t border-border px-3.5 py-2.5 text-center text-[0.8125rem] font-semibold text-cobalt-deep hover:bg-cobalt-soft/40"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 text-center">
              <p className="text-[0.8125rem] text-ink-soft">No products found matching &quot;{query}&quot;.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}