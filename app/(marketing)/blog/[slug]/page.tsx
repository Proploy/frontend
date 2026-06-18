import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Clock3 } from 'lucide-react'
import { CTABanner, Container } from '@/components/marketing'
import { POSTS, getPost, getRelated, initials, type Block, type Post } from '../posts'

/* ------------------------------------------------------------- static gen */

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Post not found · Proploy field guide' }
  return {
    title: `${post.title} · Proploy field guide`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

/* ----------------------------------------------------------------- shared */

function CategoryTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#eff4ff] px-[10px] py-[3px] text-[12px] font-medium leading-[18px] text-[#155eef]">
      {label}
    </span>
  )
}

function AuthorChip({ post, size = 'md' }: { post: Post; size?: 'md' | 'lg' }) {
  const avatar = size === 'lg' ? 'size-[48px] text-[17px]' : 'size-[40px] text-[15px]'
  return (
    <div className="flex items-center gap-[12px]">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-[#155eef] font-semibold text-white ${avatar}`}
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

/* ----------------------------------------------------------- body renderer */

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          className="mt-[16px] text-[26px] font-semibold leading-[34px] text-[#181d27] tracking-[-0.4px]"
          style={{ textWrap: 'balance' }}
        >
          {block.text}
        </h2>
      )
    case 'p':
      return <p className="text-[18px] leading-[30px] text-[#414651]">{block.text}</p>
    case 'ul':
      return (
        <ul className="flex flex-col gap-[10px] pl-[4px]">
          {block.items.map((item) => (
            <li key={item} className="flex gap-[12px] text-[18px] leading-[28px] text-[#414651]">
              <span
                className="mt-[11px] size-[6px] shrink-0 rounded-full bg-[#155eef]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="flex flex-col gap-[12px]">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-[14px] text-[18px] leading-[28px] text-[#414651]">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#eff4ff] text-[14px] font-semibold text-[#155eef]">
                {i + 1}
              </span>
              <span className="pt-[1px]">{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote className="my-[8px] border-l-[3px] border-[#155eef] pl-[24px]">
          <p className="text-[22px] font-medium leading-[32px] text-[#181d27] tracking-[-0.2px]">
            “{block.text}”
          </p>
          {block.cite && (
            <cite className="mt-[12px] block text-[15px] not-italic leading-[22px] text-[#717680]">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      )
  }
}

/* ------------------------------------------------------------------ page */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = getRelated(slug)

  return (
    <>
      {/* Header */}
      <section className="pt-[64px] pb-[40px]">
        <Container className="flex flex-col items-center">
          <div className="flex w-full max-w-[768px] flex-col gap-[24px]">
            <Link
              href="/blog"
              className="inline-flex w-fit items-center gap-[6px] text-[14px] font-semibold leading-[20px] text-[#717680] transition-colors hover:text-[#181d27]"
            >
              <ArrowLeft size={16} />
              Back to the field guide
            </Link>
            <div className="flex items-center gap-[12px]">
              <CategoryTag label={post.category} />
              <span className="inline-flex items-center gap-[5px] text-[13px] leading-[18px] text-[#717680]">
                <Clock3 size={14} /> {post.readTime}
              </span>
            </div>
            <h1
              className="text-[40px] font-semibold leading-[48px] text-[#181d27] tracking-[-0.8px] md:text-[48px] md:leading-[56px]"
              style={{ textWrap: 'balance' }}
            >
              {post.title}
            </h1>
            <p className="text-[20px] leading-[30px] text-[#535862]">{post.standfirst}</p>
            <div className="mt-[8px] flex items-center justify-between gap-[16px] border-t border-[#e9eaeb] pt-[24px]">
              <AuthorChip post={post} size="lg" />
              <span className="shrink-0 text-[14px] leading-[20px] text-[#717680]">{post.date}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Article body */}
      <section className="pb-[80px]">
        <Container className="flex flex-col items-center">
          <article className="flex w-full max-w-[768px] flex-col gap-[24px]">
            {post.body.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </article>

          {/* Author footer card */}
          <div className="mt-[56px] flex w-full max-w-[768px] flex-col gap-[16px] rounded-[20px] border border-[#e9eaeb] bg-[#fafafa] p-[28px] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-[16px]">
              <span
                className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-[#155eef] text-[20px] font-semibold text-white"
                aria-hidden
              >
                {initials(post.author)}
              </span>
              <div>
                <p className="text-[16px] font-semibold leading-[24px] text-[#181d27]">{post.author}</p>
                <p className="text-[14px] leading-[20px] text-[#717680]">{post.role}</p>
                <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">Vetted expert on the Proploy network</p>
              </div>
            </div>
            <Link
              href="/discover-experts"
              className="inline-flex w-fit shrink-0 items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa]"
            >
              Work with experts like {post.author.split(' ')[0]}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </Container>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-[#e9eaeb] py-[72px]">
          <Container>
            <h2 className="mb-[32px] text-[24px] font-semibold leading-[32px] text-[#181d27] tracking-[-0.48px]">
              Keep reading
            </h2>
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col gap-[16px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] transition-colors hover:border-[#d5d7da] hover:bg-[#fafafa]"
                >
                  <div className="flex items-center gap-[10px]">
                    <CategoryTag label={rel.category} />
                    <span className="inline-flex items-center gap-[5px] text-[13px] leading-[18px] text-[#717680]">
                      <Clock3 size={14} /> {rel.readTime}
                    </span>
                  </div>
                  <h3
                    className="text-[18px] font-semibold leading-[26px] text-[#181d27] tracking-[-0.2px]"
                    style={{ textWrap: 'balance' }}
                  >
                    {rel.title}
                  </h3>
                  <p className="text-[15px] leading-[23px] text-[#535862]">{rel.excerpt}</p>
                  <span className="mt-auto flex items-center gap-[6px] pt-[4px] text-[14px] font-semibold leading-[20px] text-[#155eef] transition-colors group-hover:text-[#004eeb]">
                    Read
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-[1px]" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

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
