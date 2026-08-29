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

  const bottomText = error && errorMessage ? errorMessage : hintText;

  return (
    <div ref={containerRef} className={`pp-field ${className}`} style={{ width: '100%' }}>
      {label && (
        <label htmlFor={selectId}>
          {label}
          {required && <span className="vo-req"> *</span>}
        </label>
      )}

      {/* Trigger + Dropdown wrapper */}
      <div style={{ position: 'relative', width: '100%' }}>
        <button
          id={selectId}
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="vo-multi"
          style={{
            minHeight: size === 'sm' ? 40 : 46,
            ...(error ? { borderColor: 'var(--color-error-300)' } : null),
            ...(disabled ? { cursor: 'not-allowed', background: 'var(--paper-deep)' } : null),
          }}
        >
          {leadingIcon && (
            <span className="pp-row" style={{ flexShrink: 0, color: 'var(--ink-soft)' }}>
              {leadingIcon}
            </span>
          )}
          <span
            className="pp-body"
            style={{
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: selectedOption ? 'var(--ink)' : 'var(--color-gray-500)',
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={size === 'sm' ? 16 : 18}
            style={{
              flexShrink: 0,
              color: 'var(--ink-soft)',
              transition: 'transform var(--d-base) var(--ease)',
              transform: isOpen ? 'rotate(180deg)' : undefined,
            }}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="vo-menu" style={{ maxHeight: 320 }}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className="vo-opt"
                >
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {option.label}
                    {option.description && (
                      <span style={{ color: 'var(--ink-soft)' }}> — {option.description}</span>
                    )}
                  </span>
                  {isSelected && <Check size={16} style={{ flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {bottomText && (
        <p
          className="pp-small"
          style={error && errorMessage ? { color: 'var(--color-error-700)' } : undefined}
        >
          {bottomText}
        </p>
      )}
    </div>
  );
}
