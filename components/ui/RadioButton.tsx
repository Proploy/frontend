'use client'

import React, { useId } from 'react';

interface RadioButtonProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  description?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
}

export default function RadioButton({
  checked = false,
  onChange,
  disabled = false,
  size = 'sm',
  label,
  description,
  className = '',
  id,
  name,
  value,
}: RadioButtonProps) {
  const generatedId = useId();
  const radioId = id || generatedId;

  const outerSize = size === 'sm' ? 'size-[16px]' : 'size-[20px]';
  const innerSize = size === 'sm' ? 'size-[6px]' : 'size-[8px]';

  const outerColors = checked
    ? disabled
      ? 'bg-[#eff4ff] border-[#84adff]'
      : 'bg-[#eff4ff] border-[#155eef]'
    : disabled
      ? 'bg-[#f5f5f5] border-[#d5d7da]'
      : 'bg-white border-[#d5d7da] hover:border-[#155eef] hover:bg-[#eff4ff]';

  return (
    <div
      className={`inline-flex gap-[8px] ${label ? 'items-start' : 'items-center'} ${className}`}
    >
      <div
        className={`relative ${outerSize} rounded-full flex items-center justify-center shrink-0 transition-colors border-[1.5px] ${outerColors} focus-within:ring-4 focus-within:ring-[#d1e0ff]`}
      >
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {checked && (
          <div
            className={`${innerSize} rounded-full ${disabled ? 'bg-[#84adff]' : 'bg-[#155eef]'}`}
          />
        )}
      </div>
      {label && (
        <label
          htmlFor={radioId}
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
