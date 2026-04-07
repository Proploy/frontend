'use client'

import React, { useId } from 'react';

interface InputFieldProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  inputType?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  required?: boolean;
  hintText?: string;
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

export default function InputField({
  placeholder = 'Search products, industries, and experts',
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  onClick,
  inputType = 'text',
  name,
  id,
  disabled = false,
  size = 'md',
  label,
  required = false,
  hintText,
  error = false,
  errorMessage,
  leadingIcon,
  trailingIcon,
  className = '',
  inputClassName = '',
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const sizeClasses = size === 'sm'
    ? 'px-[12px] py-[8px]'
    : 'px-[14px] py-[10px]';

  const borderClasses = error
    ? 'border border-[#fda29b] focus-within:ring-1 focus-within:ring-[#fda29b]'
    : 'border border-[#d5d7da] focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff]';

  const bgClasses = disabled ? 'bg-[#fafafa]' : 'bg-white';

  const showError = error && errorMessage;
  const bottomText = showError ? errorMessage : hintText;
  const bottomTextColor = showError ? 'text-[#d92d20]' : 'text-[#535862]';

  return (
    <div className={`flex flex-col gap-[6px] items-start w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="flex gap-[2px] items-start font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {label}
          {required && (
            <span className="text-[#155eef]">*</span>
          )}
        </label>
      )}
      <div
        onClick={onClick}
        className={`${bgClasses} ${borderClasses} flex gap-[8px] items-center ${sizeClasses} rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] w-full transition-colors ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        {leadingIcon && (
          <span className="shrink-0 size-[20px] flex items-center justify-center text-[#717680]">
            {leadingIcon}
          </span>
        )}
        <input
          type={inputType}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          className={`flex-1 font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] text-left bg-transparent outline-none w-full disabled:cursor-not-allowed disabled:text-[#a4a7ae] disabled:placeholder:text-[#a4a7ae] ${inputClassName}`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        />
        {error && (
          <svg
            className="shrink-0 size-[16px] text-[#d92d20]"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="currentColor" />
          </svg>
        )}
        {!error && trailingIcon && (
          <span className="shrink-0 size-[16px] flex items-center justify-center text-[#a4a7ae]">
            {trailingIcon}
          </span>
        )}
      </div>
      {bottomText && (
        <p
          className={`font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] ${bottomTextColor} w-full`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {bottomText}
        </p>
      )}
    </div>
  );
}
