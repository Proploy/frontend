import type { ReactNode } from 'react'

/**
 * The signature "real product UI inside a frame" device. Wrap any internal-app
 * mock/snippet in this to present it as a screenshot-grade product surface.
 *
 * `chrome` adds a faux browser/app top bar with traffic-light dots and an
 * optional title. Default tint is the page surface (#fafafa) so embedded
 * white cards read crisply.
 */
export function UISnippetFrame({
  children,
  chrome = true,
  title,
  className = '',
}: {
  children: ReactNode
  chrome?: boolean
  title?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[16px] border border-[#e9eaeb] bg-[#fafafa] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03)] ${className}`}
    >
      {chrome && (
        <div className="flex items-center gap-[12px] border-b border-[#e9eaeb] bg-white px-[16px] py-[12px]">
          <div className="flex items-center gap-[6px]">
            <span className="size-[10px] rounded-full bg-[#e9eaeb]" />
            <span className="size-[10px] rounded-full bg-[#e9eaeb]" />
            <span className="size-[10px] rounded-full bg-[#e9eaeb]" />
          </div>
          {title && (
            <div className="mx-auto rounded-[6px] bg-[#f5f5f5] px-[16px] py-[4px] font-medium text-[12px] leading-[18px] text-[#717680]">
              {title}
            </div>
          )}
        </div>
      )}
      <div className="p-[16px] sm:p-[24px]">{children}</div>
    </div>
  )
}
