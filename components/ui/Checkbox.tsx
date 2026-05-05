'use client'

import React, { useId, useRef, useEffect } from 'react';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  description?: string;
  className?: string;
  id?: string;
}

export default function Checkbox({
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  size = 'sm',
  label,
  description,
  className = '',
  id,
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const isChecked = checked || indeterminate;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const boxSize = size === 'sm' ? 'size-[16px]' : 'size-[20px]';
  const boxRadius = size === 'sm' ? 'rounded-[4px]' : 'rounded-[6px]';
  const iconSize = size === 'sm' ? 'size-[12px]' : 'size-[14px]';

  const boxColors = isChecked
    ? disabled
      ? 'bg-[#84adff] border-[#84adff]'
      : 'bg-[#155eef] border-[#155eef]'
    : disabled
      ? 'bg-[#f5f5f5] border-[#d5d7da]'
      : 'bg-white border-[#d5d7da] hover:border-[#155eef] hover:bg-[#eff4ff]';

  return (
    <div
      className={`inline-flex gap-[8px] ${label ? 'items-start' : 'items-center'} ${className}`}
    >
      <div
        className={`relative ${boxSize} ${boxRadius} flex items-center justify-center shrink-0 transition-colors border-[1.5px] ${boxColors} focus-within:ring-4 focus-within:ring-[#d1e0ff]`}
      >
        <input
          ref={inputRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {isChecked &&
          (indeterminate ? (
            <svg
              className={iconSize}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 7h8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className={iconSize}
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
          ))}
      </div>
      {label && (
        <label
          htmlFor={checkboxId}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} select-none`}
        >
          <div
            className={`font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] ${disabled ? 'text-[#a4a7ae]' : 'text-[#414651]'}`}
          >
            {label}
          </div>
          {description && (
            <div
              className={`font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] ${disabled ? 'text-[#a4a7ae]' : 'text-[#535862]'}`}
            >
              {description}
            </div>
          )}
        </label>
      )}
    </div>
  );
}
