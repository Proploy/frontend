'use client'

import React, { useCallback, useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  labelPosition?: 'none' | 'bottom' | 'top-floating';
  formatLabel?: (value: number) => string;
  className?: string;
}

export default function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlledValue,
  defaultValue,
  onChange,
  labelPosition = 'none',
  formatLabel = (v) => `${v}%`,
  className = '',
}: SliderProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(
    defaultValue ?? [min, Math.round((max - min) * 0.25 + min)]
  );
  const value = controlledValue ?? internalValue;

  const getPercent = (v: number) => ((v - min) / (max - min)) * 100;
  const leftPercent = getPercent(value[0]);
  const rightPercent = getPercent(value[1]);

  const updateValue = useCallback(
    (newValue: [number, number]) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [controlledValue, onChange]
  );

  const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLeft = Math.min(Number(e.target.value), value[1] - step);
    updateValue([newLeft, value[1]]);
  };

  const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRight = Math.max(Number(e.target.value), value[0] + step);
    updateValue([value[0], newRight]);
  };

  const thumbInput =
    'absolute w-full h-full top-0 left-0 appearance-none bg-transparent pointer-events-none ' +
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[24px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:bg-transparent ' +
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:size-[24px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-0';

  return (
    <div className={`relative w-full ${className}`}>
      {/* Top floating labels */}
      {labelPosition === 'top-floating' && (
        <div className="relative h-[40px] mb-[4px]">
          <div
            className="absolute"
            style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
          >
            <div className="bg-white border border-black/8 rounded-[8px] px-[12px] py-[8px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]">
              <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[12px] leading-[18px] text-[#414651] whitespace-nowrap">
                {formatLabel(value[0])}
              </span>
            </div>
          </div>
          <div
            className="absolute"
            style={{ left: `${rightPercent}%`, transform: 'translateX(-50%)' }}
          >
            <div className="bg-white border border-black/8 rounded-[8px] px-[12px] py-[8px] shadow-[0px_12px_16px_-4px_rgba(10,13,18,0.08),0px_4px_6px_-2px_rgba(10,13,18,0.03),0px_2px_2px_-1px_rgba(10,13,18,0.04)]">
              <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[12px] leading-[18px] text-[#414651] whitespace-nowrap">
                {formatLabel(value[1])}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Track area */}
      <div className="relative h-[24px]">
        {/* Background track */}
        <div className="absolute left-0 right-0 top-[8px] h-[8px] rounded-full bg-[#e9eaeb]" />

        {/* Active/progress track */}
        <div
          className="absolute top-[8px] h-[8px] rounded-full bg-[#155eef]"
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />

        {/* Left thumb (visual) */}
        <div
          className="absolute top-0 z-[1] pointer-events-none"
          style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
        >
          <div className="size-[24px] rounded-full bg-white border-2 border-[#155eef] shadow-[0px_4px_6px_-1px_rgba(10,13,18,0.1),0px_2px_4px_-2px_rgba(10,13,18,0.06)]" />
        </div>

        {/* Right thumb (visual) */}
        <div
          className="absolute top-0 z-[1] pointer-events-none"
          style={{ left: `${rightPercent}%`, transform: 'translateX(-50%)' }}
        >
          <div className="size-[24px] rounded-full bg-white border-2 border-[#155eef] shadow-[0px_4px_6px_-1px_rgba(10,13,18,0.1),0px_2px_4px_-2px_rgba(10,13,18,0.06)]" />
        </div>

        {/* Left range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleLeftChange}
          aria-label="Range minimum"
          className={`${thumbInput} z-[3]`}
        />

        {/* Right range input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={handleRightChange}
          aria-label="Range maximum"
          className={`${thumbInput} z-[4]`}
        />
      </div>

      {/* Bottom labels */}
      {labelPosition === 'bottom' && (
        <div className="relative h-[28px] mt-[4px]">
          <div
            className="absolute"
            style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#181d27] whitespace-nowrap">
              {formatLabel(value[0])}
            </span>
          </div>
          <div
            className="absolute"
            style={{ left: `${rightPercent}%`, transform: 'translateX(-50%)' }}
          >
            <span className="font-[family-name:var(--font-dm-sans)] font-medium text-[16px] leading-[24px] text-[#181d27] whitespace-nowrap">
              {formatLabel(value[1])}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
