import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { CTABanner, Container, SectionHeading } from '@/components/marketing'
import { CATEGORIES, getFeatured, getGridPosts, initials, type Post } from './posts'

export const metadata: Metadata = {
  title: 'The Proploy field guide · Implementation insights',
  description:
    'Playbooks, evaluation frameworks, and field notes on selecting, scoping, and rolling out software — written by the experts who do the work.',
}

const featured = getFeatured()
const posts = getGridPosts()

/* --------------------------------------------------------------- helpers */

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
      {label}
    </span>
  )
}

function PostMeta({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-[12px]">
      <span
        className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[15px] font-semibold text-white"
        aria-hidden
      >
        {initials(post.author)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{post.author}</p>
        <p className="truncate text-[13px] leading-[18px] text-[#717680]">{post.role}</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ page */

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[96px] pb-[48px]">
        <Container className="flex flex-col items-center">
          <SectionHeading
            align="center"
            title="The Proploy field guide"
            body="Playbooks, evaluation frameworks, and field notes on selecting, scoping, and rolling out software — written by the vetted experts who do the work."
          />
        </Container>
      </section>

      {/* Category filter chips (static) */}
      <section className="pb-[40px]">
        <Container>
          <div className="flex flex-wrap justify-center gap-[10px]">
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                className={`inline-flex items-center rounded-full border px-[16px] py-[8px] text-[14px] font-medium leading-[20px] transition-colors ${
                  i === 0
                    ? 'border-[#155eef] bg-[#155eef] text-white'
                    : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa]'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured post */}
      <section className="pb-[64px]">
        <Container>
          <Link
            href={`/blog/${featured.slug}`}
            className="group block overflow-hidden rounded-[24px] border border-[#e9eaeb] bg-white transition-colors hover:border-[#d5d7da]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Visual panel */}
              <div className="relative hidden min-h-[320px] bg-[#155eef] lg:block">
                <div
                  className="absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                  aria-hidden
                />
                <div className="absolute inset-0 flex flex-col justify-end gap-[10px] p-[40px]">
                  <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-[12px] py-[4px] text-[13px] font-medium leading-[18px] text-white">
                    Featured
                  </span>
                  <p className="max-w-[360px] text-[20px] font-semibold leading-[28px] text-white tracking-[-0.2px]">
                    Field notes from a live ERP program — start to go-live.
                  </p>
                </div>
              </div>
              {/* Copy panel */}
              <div className="flex flex-col gap-[24px] p-[40px]">
                <div className="flex items-center gap-[12px]">
                  <CategoryTag label={featured.category} />
                  <span className="inline-flex items-center gap-[5px] text-[13px] leading-[18px] text-[#717680]">
                    <Clock3 size={14} /> {featured.readTime}
                  </span>
                </div>
                <h2
                  className="text-[30px] font-semibold leading-[38px] text-[#181d27] tracking-[-0.6px]"
                  style={{ textWrap: 'balance' }}
                >
                  {featured.title}
                </h2>
                <p className="text-[17px] leading-[26px] text-[#535862]">{featured.excerpt}</p>
                <div className="mt-auto flex items-center justify-between gap-[12px] border-t border-[#e9eaeb] pt-[24px]">
                  <PostMeta post={featured} />
                  <span className="flex items-center gap-[6px] text-[14px] font-semibold leading-[20px] text-[#155eef] transition-colors group-hover:text-[#004eeb]">
                    Read
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-[1px]" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </Container>
      </section>

      {/* Post grid */}
      <section className="pb-[96px]">
        <Container>
          <h2 className="mb-[32px] text-[24px] font-semibold leading-[32px] text-[#181d27] tracking-[-0.48px]">
            Latest from the network
          </h2>
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-[20px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
              >
                <div className="flex items-center gap-[10px]">
                  <CategoryTag label={post.category} />
                  <span className="inline-flex items-center gap-[5px] text-[13px] leading-[18px] text-[#717680]">
                    <Clock3 size={14} /> {post.readTime}
                  </span>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <h3
                    className="text-[19px] font-semibold leading-[27px] text-[#181d27] tracking-[-0.2px]"
                    style={{ textWrap: 'balance' }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-[15px] leading-[23px] text-[#535862]">{post.excerpt}</p>
                </div>
                <div className="mt-auto flex items-center justify-between gap-[12px] border-t border-[#e9eaeb] pt-[20px]">
                  <PostMeta post={post} />
                  <span className="shrink-0 text-[13px] leading-[18px] text-[#717680]">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter CTA */}
      <CTABanner
        variant="dark"
        title="One implementation playbook in your inbox each month"
        body="No fluff — just the frameworks, checklists, and post-mortems our vetted experts use to ship software on time. Unsubscribe anytime."
        primary={{ label: 'Subscribe to the field guide', href: '/contact' }}
        secondary={{ label: 'Browse all topics', href: '/blog' }}
      />
    </>
  )
}
