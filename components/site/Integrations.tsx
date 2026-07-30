'use client'

import { useMemo } from "react";
import { CatalogImage } from "@/components/catalog/CatalogImage";
import { useProductList, type CardProduct } from "@/features/catalog";
import { Reveal } from "./Reveal";

function Ring({
  items,
  radius,
  size,
  reverse,
}: {
  items: CardProduct[];
  radius: number;
  size: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border ${
        reverse ? "spin-slower-rev" : "spin-slow"
      }`}
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
    >
      {items.map((p, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const x = radius + Math.cos(angle) * radius - size / 2;
        const y = radius + Math.sin(angle) * radius - size / 2;
        return (
          <div
            key={p.product_id}
            title={p.product_name}
            className={`absolute grid place-items-center overflow-hidden rounded-2xl border border-border bg-white shadow-[0_10px_28px_-20px_rgba(21,94,239,0.7)] ${
              reverse ? "spin-slower" : "spin-slow-rev"
            }`}
            style={{ left: Math.round(x), top: Math.round(y), width: size, height: size }}
          >
            <CatalogImage
              src={p.product_logo as string}
              alt={`${p.product_name} logo`}
              className="size-full object-contain p-[12px]"
              fallback={
                <span className="text-[0.85rem] font-bold text-cobalt-deep">
                  {p.product_name.charAt(0)}
                </span>
              }
            />
          </div>
        );
      })}
    </div>
  );
}

export function Integrations() {
  const { products } = useProductList({ limit: 100, sort: "market_presence" });
  // Dedupe by logo so the constellation shows distinct brands (the catalog has
  // several products sharing one brand logo, e.g. multiple Microsoft apps).
  const logos = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      if (!p.product_logo) return false;
      const brand = p.vendor_name ?? p.product_logo; // one logo per brand
      if (seen.has(brand)) return false;
      seen.add(brand);
      return true;
    });
  }, [products]);

  // Split the real catalog logos across the two orbiting rings.
  const inner = logos.slice(0, 6);
  const outer = logos.slice(6, 11);

  return (
    <section id="integrations" className="relative overflow-hidden border-y border-border bg-white/60 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal>
          <span className="label">Integrations</span>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
            Connects to the tools your teams already run.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1rem] leading-relaxed text-ink-soft">
            30+ apps and growing — finance, identity, ticketing, data warehouse. Procurement data
            flows both ways, so spend, contracts and delivery status stay in one place.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="display text-[2.5rem] text-cobalt">30+</span>
            <span className="label max-w-[14ch] leading-relaxed">apps connected and growing</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_14%,transparent),transparent_62%)] blur-xl" />
            {outer.length > 0 && <Ring items={outer} radius={215} size={62} reverse />}
            {inner.length > 0 && <Ring items={inner} radius={135} size={62} />}
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-border bg-ink shadow-[0_30px_60px_-30px_var(--cobalt)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/proploy-logomark-white.png"
                alt="Proploy"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
