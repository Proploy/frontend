'use client'

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  required?: boolean;
  helperText?: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelectDropdown({
  label,
  required,
  helperText,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select…',
  disabled = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }
    onChange([...selectedValues, value]);
  };

  return (
    <div className="pp-field" ref={containerRef}>
      <label>
        {helperText ? (
          <span className="vo-label-tip" data-tip={helperText}>{label}</span>
        ) : label}{' '}{required && <span className="vo-req">*</span>}
      </label>

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="vo-multi"
        disabled={disabled}
      >
        <span className="vo-multi-values">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <span key={value} className="pp-tag pp-tag--cobalt">
                {value}
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${value}`}
                  className="pp-tag-x"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleValue(value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleValue(value);
                    }
                  }}
                >
                  <X size={12} />
                </span>
              </span>
            ))
          ) : (
            <span className="vo-multi-ph">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            color: 'var(--ink-soft)',
            transition: 'transform var(--d-base) var(--ease)',
            transform: isOpen ? 'rotate(180deg)' : undefined,
          }}
        />
      </button>

      {isOpen && (
        <div className="vo-menu-wrap">
          <div className="vo-menu">
            {options.length === 0 && <p className="pp-small" style={{ padding: 10 }}>No options yet.</p>}
            {options.map((option) => {
              const selected = selectedValues.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleValue(option)}
                  className="vo-opt"
                >
                  <span>{option}</span>
                  {selected && <span className="pp-label">Selected</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
