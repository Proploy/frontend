'use client'

import Link from "next/link";
import { useMemo } from "react";
import { CatalogImage } from "@/components/catalog/CatalogImage";
import { getProductDetailHref, useProductList } from "@/features/catalog";

// Real logos: pulls the catalog's most market-present products and marquees the
// ones that actually have a logo — the same source the legacy homepage used.
export function LogoMarquee() {
  const { products, loading } = useProductList({ limit: 100, sort: "market_presence" });
  // Dedupe by logo (the catalog has several products per brand) and cap the set
  // so the loop stays tight — a shorter track reads calmer at a given duration.
  const logos = useMemo(() => {
    const seen = new Set<string>();
    const out: typeof products = [];
    for (const p of products) {
      if (!p.product_logo) continue;
      const brand = p.vendor_name ?? p.product_logo; // one logo per brand
      if (seen.has(brand)) continue;
      seen.add(brand);
      out.push(p);
      if (out.length >= 16) break;
    }
    return out;
  }, [products]);

  return (
    <section
      aria-label="Companies growing with Proploy"
      className="relative border-y border-border bg-white/50 py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--paper),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--paper),transparent)]" />
      {loading || logos.length === 0 ? (
        <div className="h-[40px] w-full" aria-hidden />
      ) : (
        <div className="flex overflow-hidden">
          <ul
            className="marquee-track flex shrink-0 items-center gap-12 pr-12"
            style={{ animationDuration: "70s" }}
          >
            {[...logos, ...logos].map((p, i) => (
              <li key={`${p.product_id}-${i}`} className="shrink-0">
                <Link
                  href={getProductDetailHref(p.product_id)}
                  title={p.product_name}
                  aria-label={`View ${p.product_name}`}
                  className="group flex h-[40px] items-center gap-[10px] opacity-70 outline-offset-4 transition-opacity duration-300 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cobalt"
                >
                  <span className="grid size-[32px] shrink-0 place-items-center overflow-hidden rounded-[6px] border border-border bg-white">
                    <CatalogImage
                      src={p.product_logo as string}
                      alt=""
                      className="size-full object-contain p-[3px]"
                      fallback={
                        <span className="text-[13px] font-bold text-cobalt-deep">
                          {p.product_name.charAt(0)}
                        </span>
                      }
                    />
                  </span>
                  <span className="display max-w-[160px] truncate text-[1.05rem] tracking-[-0.02em] text-ink-soft/70 transition-colors duration-300 group-hover:text-ink">
                    {p.product_name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
