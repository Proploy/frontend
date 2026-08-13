'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function isExternalHref(href: string | undefined): boolean {
  return Boolean(href && /^https?:\/\//i.test(href))
}

function cleanMarkdown(text: string): string {
  if (!text) return ''
  return text
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/```(?:json)?\s*\{\s*"(?:SELECTED_PRODUCT_IDS|tool_name|tool_id|candidate_data|artifact_proposal|needs_profile_summary)"[\s\S]*?\}\s*```/gi, '')
    .replace(/\{\s*"(?:SELECTED_PRODUCT_IDS|tool_name|tool_id|candidate_data|artifact_proposal|needs_profile_summary)"[\s\S]*?\}/gi, '')
    .replace(/(?:SELECTED_PRODUCT_IDS|tool_name|tool_id|candidate_data|artifact_proposal|needs_profile_summary):\s*(?:\[|\{)[\s\S]*?(?:\]|\})/gi, '')
    .replace(/```(?:json)?\s*\[\s*\{\s*"product_id"[\s\S]*?\]\s*```/gi, '')
    .replace(/(?:,\s*)?\{\s*"product_id"[\s\S]*?\}(?:\s*,)?/gi, '')
    .replace(/\[\s*\]/gi, '')
    .trim()
}

export function MarkdownMessage({ content }: { content: string }) {
  const sanitized = cleanMarkdown(content)
  return (
    <div className="min-w-0 text-[15px] leading-[24px] text-[#181d27]">
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
            <blockquote className="my-[10px] border-l-2 border-[#84adff] bg-[#f5f8ff] px-[12px] py-[8px] text-[#414651]">
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
                className="font-medium text-[#155eef] underline decoration-[#84adff] underline-offset-2 hover:text-[#0e4cc7]"
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
                    : 'rounded-[4px] bg-[#f2f4f7] px-[5px] py-[2px] text-[13px] text-[#344054]'
                }
              >
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-[10px] max-w-full overflow-x-auto rounded-[8px] bg-[#181d27] p-[12px]">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-[10px] max-w-full overflow-x-auto rounded-[8px] border border-[#e9eaeb]">
              <table className="w-full border-collapse text-left text-[13px] leading-[20px]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#f5f8ff]">{children}</thead>,
          th: ({ children }) => (
            <th className="border-b border-[#e9eaeb] px-[10px] py-[8px] font-semibold text-[#414651]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[#e9eaeb] px-[10px] py-[8px] align-top last:border-b-0">
              {children}
            </td>
          ),
          hr: () => <hr className="my-[16px] border-0 border-t border-[#e9eaeb]" />,
        }}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  )
}
