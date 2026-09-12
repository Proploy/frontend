'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cleanMarkdown } from '@/features/ai-workspace/clean-markdown'

function isExternalHref(href: string | undefined): boolean {
  return Boolean(href && /^https?:\/\//i.test(href))
}

export function MarkdownMessage({ content }: { content: string }) {
  const sanitized = cleanMarkdown(content)
  return (
    <div className="min-w-0 text-[15px] leading-[24px] text-ink">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-[10px] mt-[18px] text-[24px] font-semibold leading-[32px] first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-[8px] mt-[16px] text-[20px] font-semibold leading-[28px] first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-[6px] mt-[14px] text-[17px] font-semibold leading-[24px] first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-[8px] first:mt-0 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="my-[8px] list-disc space-y-[4px] pl-[22px]">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-[8px] list-decimal space-y-[4px] pl-[22px]">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-[2px]">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-[10px] border-l-2 border-cobalt/40 bg-cobalt-soft/50 px-[12px] py-[8px] text-ink-soft">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => {
            const external = isExternalHref(href)
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                className="font-medium text-cobalt underline decoration-cobalt/40 underline-offset-2 hover:text-cobalt-deep"
              >
                {children}
              </a>
            )
          },
          code: ({ className, children }) => {
            const fenced = Boolean(className?.startsWith('language-'))
            return (
              <code
                className={
                  fenced
                    ? `${className ?? ''} text-[13px] leading-[20px] text-[#f5f5f5]`
                    : 'rounded-[4px] bg-paper-deep px-[5px] py-[2px] text-[13px] text-ink-soft'
                }
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-[10px] max-w-full overflow-x-auto rounded-[8px] bg-ink p-[12px]">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-[10px] max-w-full overflow-x-auto rounded-[8px] border border-border">
              <table className="w-full border-collapse text-left text-[13px] leading-[20px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-cobalt-soft/50">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-border px-[10px] py-[8px] font-semibold text-ink-soft">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-[10px] py-[8px] align-top last:border-b-0">
              {children}
            </td>
          ),
          hr: () => <hr className="my-[16px] border-0 border-t border-border" />,
        }}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  )
}
