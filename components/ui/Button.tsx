'use client'

import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'link-color' | 'link-gray';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  iconOnly?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const sizeConfig = {
  sm: {
    height: 'h-[36px]',
    padding: 'px-[12px]',
    iconBox: 'size-[36px]',
    fontSize: 'text-[14px] leading-[20px]',
    iconSize: 'size-[20px]',
    gap: 'gap-[4px]',
    radius: 'rounded-[8px]',
  },
  md: {
    height: 'h-[40px]',
    padding: 'px-[14px]',
    iconBox: 'size-[40px]',
    fontSize: 'text-[14px] leading-[20px]',
    iconSize: 'size-[20px]',
    gap: 'gap-[4px]',
    radius: 'rounded-[8px]',
  },
  lg: {
    height: 'h-[44px]',
    padding: 'px-[16px]',
    iconBox: 'size-[44px]',
    fontSize: 'text-[16px] leading-[24px]',
    iconSize: 'size-[20px]',
    gap: 'gap-[6px]',
    radius: 'rounded-[8px]',
  },
  xl: {
    height: 'h-[48px]',
    padding: 'px-[18px]',
    iconBox: 'size-[48px]',
    fontSize: 'text-[16px] leading-[24px]',
    iconSize: 'size-[20px]',
    gap: 'gap-[6px]',
    radius: 'rounded-[8px]',
  },
};

const variantConfig = {
  primary: {
    base: 'bg-[#155eef] text-white border-2 border-white/12 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-clip',
    hover: 'hover:bg-[#004eeb]',
    focus: 'focus-visible:ring-4 focus-visible:ring-[#d1e0ff] focus-visible:outline-none',
    disabled: 'disabled:bg-[#84adff] disabled:border-white/12 disabled:cursor-not-allowed',
    loading: 'bg-[#004eeb]',
    hasOverlay: true,
    isLink: false,
  },
  secondary: {
    base: 'bg-white text-[#414651] border border-[#d5d7da] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-clip',
    hover: 'hover:bg-[#fafafa]',
    focus: 'focus-visible:ring-4 focus-visible:ring-[#d1e0ff] focus-visible:outline-none',
    disabled: 'disabled:bg-white disabled:text-[#a4a7ae] disabled:border-[#e9eaeb] disabled:cursor-not-allowed',
    loading: '',
    hasOverlay: true,
    isLink: false,
  },
  tertiary: {
    base: 'bg-transparent text-[#535862]',
    hover: 'hover:bg-[#fafafa]',
    focus: 'focus-visible:ring-4 focus-visible:ring-[#d1e0ff] focus-visible:outline-none',
    disabled: 'disabled:text-[#a4a7ae] disabled:cursor-not-allowed',
    loading: '',
    hasOverlay: false,
    isLink: false,
  },
  'link-color': {
    base: 'bg-transparent text-[#004eeb]',
    hover: 'hover:text-[#155eef]',
    focus: 'focus-visible:ring-4 focus-visible:ring-[#d1e0ff] focus-visible:outline-none focus-visible:rounded-[4px]',
    disabled: 'disabled:text-[#a4a7ae] disabled:cursor-not-allowed',
    loading: '',
    hasOverlay: false,
    isLink: true,
  },
  'link-gray': {
    base: 'bg-transparent text-[#535862]',
    hover: 'hover:text-[#414651]',
    focus: 'focus-visible:ring-4 focus-visible:ring-[#d1e0ff] focus-visible:outline-none focus-visible:rounded-[4px]',
    disabled: 'disabled:text-[#a4a7ae] disabled:cursor-not-allowed',
    loading: '',
    hasOverlay: false,
    isLink: true,
  },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Submitting...',
  iconOnly = false,
  leadingIcon,
  trailingIcon,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  const classes = [
    'inline-flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-semibold whitespace-nowrap transition-colors relative',
    s.fontSize,
    s.gap,
    s.radius,
    v.isLink ? '' : iconOnly ? s.iconBox : `${s.height} ${s.padding}`,
    v.base,
    loading && v.loading,
    !isDisabled && v.hover,
    v.focus,
    isDisabled && v.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      whileHover={!isDisabled ? { filter: 'brightness(0.97)' } : undefined}
      whileTap={!isDisabled ? { filter: 'brightness(0.94)' } : undefined}
      transition={{ duration: 0.15 }}
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={classes}
    >
      {loading ? (
        <>
          <Spinner className={s.iconSize} />
          {!iconOnly && <span>{loadingText}</span>}
        </>
      ) : (
        <>
          {leadingIcon && (
            <span className={`${s.iconSize} flex items-center justify-center`}>
              {leadingIcon}
            </span>
          )}
          {!iconOnly && children}
          {trailingIcon && (
            <span className={`${s.iconSize} flex items-center justify-center`}>
              {trailingIcon}
            </span>
          )}
        </>
      )}
      {v.hasOverlay && (
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
      )}
    </motion.button>
  );
}
