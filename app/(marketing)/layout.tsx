import Footer from '@/components/Footer'

/**
 * Shared chrome for every (marketing) page. Navbar is global (root layout); this
 * group adds the fixed-nav top offset, the DM Sans family, and the Footer so
 * individual pages only render their sections.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white pt-[80px] font-[family-name:var(--font-dm-sans)] flex flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
