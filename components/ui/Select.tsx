'use client'

import React, { useId, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  label?: string;
  required?: boolean;
  hintText?: string;
  error?: boolean;
  errorMessage?: string;
  leadingIcon?: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  size = 'md',
  label,
  required = false,
  hintText,
  error = false,
  errorMessage,
  leadingIcon,
  className = '',
  id,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const sizeClasses = size === 'sm'
    ? 'px-[12px] py-[8px]'
    : 'px-[14px] py-[10px]';

  const chevronSize = size === 'sm' ? 16 : 20;

  const borderClasses = error
    ? 'border border-[#fda29b]'
    : isOpen
      ? 'border border-[#2970ff] ring-1 ring-[#2970ff]'
      : 'border border-[#d5d7da]';

  const bgClasses = disabled ? 'bg-[#fafafa]' : 'bg-white';

  const showError = error && errorMessage;
  const bottomText = showError ? errorMessage : hintText;
  const bottomTextColor = showError ? 'text-[#d92d20]' : 'text-[#535862]';

  return (
    <div ref={containerRef} className={`flex flex-col gap-[6px] items-start w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="flex gap-[2px] items-start font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#414651]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {label}
          {required && <span className="text-[#155eef]">*</span>}
        </label>
      )}

      {/* Trigger + Dropdown wrapper */}
      <div className="relative w-full">
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`${bgClasses} ${borderClasses} flex gap-[8px] items-center ${sizeClasses} rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] w-full transition-colors text-left ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {leadingIcon && (
            <span className="shrink-0 size-[20px] flex items-center justify-center text-[#717680]">
              {leadingIcon}
            </span>
          )}
          <span
            className={`flex-1 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] truncate ${
              selectedOption
                ? 'font-medium text-[#181d27]'
                : 'font-normal text-[#717680]'
            } ${disabled ? 'text-[#a4a7ae]' : ''}`}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={chevronSize}
            className={`shrink-0 text-[#535862] transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-[#a4a7ae]' : ''}`}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-[4px] z-50 bg-white border border-black/8 rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)] py-[4px] max-h-[320px] overflow-auto">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="flex items-center gap-[8px] px-[6px] py-px cursor-pointer"
                >
                  <div
                    className={`flex-1 flex items-center gap-[8px] px-[8px] py-[10px] rounded-[6px] ${
                      isSelected ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-[8px]">
                      <span
                        className="font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#181d27]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      >
                        {option.label}
                      </span>
                      {option.description && (
                        <span
                          className="font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#535862]"
                          style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                          {option.description}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={20} className="shrink-0 text-[#155eef]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
