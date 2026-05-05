'use client'

import React from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

type TagSize = 'sm' | 'md' | 'lg'
type TagIcon = 'dot' | 'country' | 'avatar'
type TagAction = 'text-only' | 'x-close' | 'count'

interface TagProps {
  children: string
  size?: TagSize
  icon?: TagIcon
  action?: TagAction
  count?: number
  checkbox?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onClose?: () => void
  avatarSrc?: string
  countrySrc?: string
  dotColor?: string
  className?: string
}

const sizeConfig = {
  sm: {
    height: 'h-[24px]',
    padding: 'px-[7px]',
    fontSize: 'text-[12px] leading-[18px]',
    gap: 'gap-[4px]',
    radius: 'rounded-[6px]',
    dotSize: 'size-[6px]',
    iconSize: 'size-[14px]',
    checkboxSize: 'size-[14px]',
    checkIconSize: 'size-[10px]',
    closeSize: 14,
    countPadding: 'px-[5px] py-[0px]',
    countFontSize: 'text-[12px] leading-[18px]',
  },
  md: {
    height: 'h-[24px]',
    padding: 'px-[9px]',
    fontSize: 'text-[14px] leading-[20px]',
    gap: 'gap-[4px]',
    radius: 'rounded-[6px]',
    dotSize: 'size-[6px]',
    iconSize: 'size-[16px]',
    checkboxSize: 'size-[16px]',
    checkIconSize: 'size-[12px]',
    closeSize: 14,
    countPadding: 'px-[6px] py-[0px]',
    countFontSize: 'text-[12px] leading-[18px]',
  },
  lg: {
    height: 'h-[28px]',
    padding: 'px-[9px]',
    fontSize: 'text-[14px] leading-[20px]',
    gap: 'gap-[5px]',
    radius: 'rounded-[6px]',
    dotSize: 'size-[8px]',
    iconSize: 'size-[18px]',
    checkboxSize: 'size-[16px]',
    checkIconSize: 'size-[12px]',
    closeSize: 16,
    countPadding: 'px-[6px] py-[0px]',
    countFontSize: 'text-[12px] leading-[18px]',
  },
}

export default function Tag({
  children,
  size = 'md',
  icon,
  action = 'text-only',
  count,
  checkbox = false,
  checked = false,
  onCheckedChange,
  onClose,
  avatarSrc,
  countrySrc,
  dotColor = '#17b26a',
  className = '',
}: TagProps) {
  const s = sizeConfig[size]

  return (
    <span
      className={`inline-flex items-center ${s.height} ${s.padding} ${s.gap} ${s.radius} bg-white border border-[#d0d5dd] font-[family-name:var(--font-dm-sans)] font-medium ${s.fontSize} text-[#344054] whitespace-nowrap ${className}`}
    >
      {checkbox && (
        <span className="relative flex items-center justify-center shrink-0">
          <span
            className={`${s.checkboxSize} rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${
              checked
                ? 'bg-[#155eef] border-[#155eef]'
                : 'bg-white border-[#d0d5dd]'
            }`}
          >
            {checked && (
              <svg
                className={s.checkIconSize}
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5 3.5L5.5 9.5L2.5 6.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </span>
      )}

      {icon === 'dot' && (
        <span
          className={`${s.dotSize} rounded-full shrink-0`}
          style={{ backgroundColor: dotColor }}
        />
      )}

      {icon === 'country' && countrySrc && (
        <Image
          src={countrySrc}
          alt=""
          width={16}
          height={12}
          className={`${s.iconSize} object-cover rounded-[2px] shrink-0`}
        />
      )}

      {icon === 'avatar' && avatarSrc && (
        <Image
          src={avatarSrc}
          alt=""
          width={16}
          height={16}
          className={`${s.iconSize} rounded-full object-cover shrink-0`}
        />
      )}

      <span>{children}</span>

      {action === 'count' && (
        <span
          className={`inline-flex items-center justify-center ${s.countPadding} rounded-full bg-[#f2f4f7] ${s.countFontSize} font-medium text-[#344054]`}
        >
          {count ?? 0}
        </span>
      )}

      {action === 'x-close' && (
        <button
          onClick={onClose}
          className="flex items-center justify-center text-[#98a2b3] hover:text-[#667085] transition-colors cursor-pointer shrink-0"
        >
          <X size={s.closeSize} strokeWidth={2} />
        </button>
      )}
    </span>
  )
}
