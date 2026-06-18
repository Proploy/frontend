import { Container } from './primitives'

export interface Metric {
  value: string
  label: string
  sub?: string
}

/**
 * Stat band ("400+ / 600% / 10k"). Big brand-blue numerals over a short label.
 * `tint` puts it on the surface tint; otherwise it sits on white.
 */
export function MetricStat({ metrics, tint = false }: { metrics: Metric[]; tint?: boolean }) {
  return (
    <section className={`py-[96px] ${tint ? 'bg-[#fafafa]' : ''}`}>
      <Container>
        <div className="flex flex-wrap justify-center gap-x-[32px] gap-y-[64px]">
          {metrics.map((m) => (
            <div key={m.label} className="flex-1 min-w-[240px] flex flex-col items-center gap-[12px] text-center">
              <p className="font-semibold text-[60px] leading-[72px] text-[#155eef] tracking-[-1.2px]">{m.value}</p>
              <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{m.label}</p>
              {m.sub && <p className="font-normal text-[16px] leading-[24px] text-[#535862] max-w-[280px]">{m.sub}</p>}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
