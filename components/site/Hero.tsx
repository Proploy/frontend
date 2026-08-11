'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { getProductDetailHref, useKeywordSearch } from "@/features/catalog";
import { MatchConsole } from "./MatchConsole";
import { Reveal } from "./Reveal";

const heroMesh = "/hero-mesh.jpg";
const WORDS = ["Discover.", "Decide.", "Deploy.", "Done."];

function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [resultsOpen, setResultsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  React.useEffect(() => {
    if (query.trim().length > 1) {
      void search(query, 6);
    } else {
      clear();
    }
    setSelectedIndex(-1);
  }, [clear, query, search]);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSubmit = (targetQuery?: string) => {
    const value = (targetQuery ?? query).trim();
    if (!value) return;
    setResultsOpen(false);
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" || e.key === "ArrowRight") {
      if (ghostSuffix && fullCompletion && inputRef.current?.selectionStart === query.length) {
        e.preventDefault();
        setQuery(fullCompletion);
        return;
      }
    }

    if (!resultsOpen || products.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedProduct = products[selectedIndex];
      if (selectedProduct) {
        setResultsOpen(false);
        router.push(getProductDetailHref(selectedProduct.product_id));
      }
    } else if (e.key === "Escape") {
      setResultsOpen(false);
    }
  };

  const applyCorrection = (correction: string) => {
    setQuery(correction);
    void search(correction, 6);
  };

  return (
    <div ref={searchRef} className="relative max-w-[520px]">
      <form
        id="hero-search"
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedIndex >= 0 && products[selectedIndex]) {
            router.push(getProductDetailHref(products[selectedIndex].product_id));
            setResultsOpen(false);
          } else {
            handleSubmit();
          }
        }}
        className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-[0_24px_60px_-46px_color-mix(in_oklab,var(--cobalt)_80%,transparent)] sm:flex-row sm:items-center"
      >
        <label htmlFor="hero-q" className="sr-only">
          What are you trying to solve?
        </label>
        <div className="relative flex flex-1 items-center min-w-0">
          {ghostSuffix && query.length > 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-2.5 z-0 select-none text-[0.9375rem] whitespace-pre text-ink-soft/40"
            >
              <span className="opacity-0">{query}</span>
              <span>{ghostSuffix}</span>
            </div>
          )}
          <input
            ref={inputRef}
            id="hero-q"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResultsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length > 1) setResultsOpen(true);
            }}
            placeholder="What are you trying to solve?"
            className="relative z-10 w-full min-w-0 bg-transparent px-3.5 py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-ink-soft/70"
          />
        </div>
        <button
          type="submit"
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cobalt px-5 text-[0.875rem] font-medium text-white transition-all duration-300 hover:bg-cobalt-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        >
          Find your software
          <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" aria-hidden>
            <path d="M4 10h11m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      {resultsOpen && query.trim().length > 1 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] max-h-[380px] overflow-y-auto rounded-2xl border border-border bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.25)]">
          {suggestedCorrection && (
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

          {loading ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-ink-soft">Searching products…</p>
          ) : error ? (
            <p className="px-4 py-3.5 text-center text-[0.8125rem] text-red-600">Unable to search products.</p>
          ) : products.length > 0 ? (
            <div className="py-1.5">
              {products.map((product, idx) => (
                <Link
                  key={product.product_id}
                  href={getProductDetailHref(product.product_id)}
                  onClick={() => setResultsOpen(false)}
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

export function Hero() {
  return (
    <section id="top" className="relative z-20 pt-28 pb-16 lg:pt-36 lg:pb-24">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroMesh}
          alt=""
          width={1600}
          height={1200}
          className="absolute -right-40 -top-24 w-[560px] max-w-none opacity-40 mix-blend-multiply [mask-image:radial-gradient(60%_60%_at_50%_45%,black_45%,transparent_88%)] [mask-repeat:no-repeat] lg:-right-24 lg:w-[900px] lg:opacity-45"
        />
        <div className="absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_18%,transparent),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-10">
        <div className="min-w-0">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cobalt" />
              <span className="label !text-[0.65rem]">AI software + expert marketplace</span>
            </span>
          </Reveal>

          <h1 className="display mt-7 text-[clamp(2.9rem,7.4vw,5.25rem)] text-ink">
            {WORDS.map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <span
                  className="block animate-[fade-in_0.9s_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{
                    animationDelay: `${i * 110}ms`,
                    color: i === 3 ? "var(--cobalt)" : undefined,
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <Reveal delay={120}>
            <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              An AI marketplace that matches your business with the right software —{" "}
              <span className="text-ink">and the vetted experts who make it land.</span> Because
              buying the tool was never the hard part.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-9">
              <HeroSearch />
            </div>
          </Reveal>

          <Reveal delay={280}>
            <p className="mt-6 flex items-center gap-3 text-[0.8125rem] text-ink-soft">
              <span className="flex -space-x-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="h-5 w-5 rounded-full border-2 border-paper bg-[linear-gradient(135deg,var(--cobalt),var(--cobalt-deep))]"
                    style={{ opacity: 1 - i * 0.18 }}
                  />
                ))}
              </span>
              Join <strong className="font-semibold text-ink">4,000+ companies</strong> already
              growing with Proploy
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="min-w-0 lg:pl-6">
          <MatchConsole />
        </Reveal>
      </div>
    </section>
  );
}
