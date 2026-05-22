'use client'

import React, { useState } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';

interface PortfolioStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

interface AddedLink {
  url: string;
  visible: boolean;
}

function FileUploadArea({ helperText }: { helperText: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[176px] bg-white border-2 border-dashed border-[#d5d7da] rounded-[8px] cursor-pointer hover:border-[#155eef] transition-colors">
      {/* Upload icon circle */}
      <div className="w-[48px] h-[48px] rounded-full bg-[#f5f5f6] flex items-center justify-center mb-[12px]">
        <Upload className="w-[20px] h-[20px] text-[#535862]" />
      </div>

      {/* Main text */}
      <p className="font-[family-name:var(--font-inter)] font-normal text-[16px] leading-[24px] text-[#414651]">
        Drag and drop files here, or{' '}
        <span className="text-[#155eef] font-medium cursor-pointer">browse</span>
      </p>

      {/* Helper text */}
      <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862] mt-[4px]">
        {helperText}
      </p>
    </div>
  );
}

export default function PortfolioStep({ formData, setFormData }: PortfolioStepProps) {
  const [linkInput, setLinkInput] = useState('');

  const links: AddedLink[] = formData?.portfolioLinks ?? [];

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;

    const updatedLinks = [...links, { url: trimmed, visible: true }];
    setFormData({ ...formData, portfolioLinks: updatedLinks });
    setLinkInput('');
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setFormData({ ...formData, portfolioLinks: updatedLinks });
  };

  const handleToggleVisibility = (index: number) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, visible: !link.visible } : link
    );
    setFormData({ ...formData, portfolioLinks: updatedLinks });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  return (
    <div className="flex flex-col gap-[32px]">
      {/* Section 1: Video introduction */}
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[30px] text-[#181d27]">
          Video introduction
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862] mb-[10px]">
          Suggested length: 30 to 90 seconds.
        </p>
        <FileUploadArea helperText="Max 200 MB" />
      </div>

      {/* Section 2: Portfolio and certificates */}
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[30px] text-[#181d27]">
          Portfolio and certificates
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862] mb-[10px]">
          PDF, PNG, JPG. Max 25 MB each.
        </p>
        <FileUploadArea helperText="PDF, PNG, JPG. Max 25 MB each." />

        {/* Add a link subsection */}
        <div className="flex flex-col gap-[6px] mt-[16px]">
          <label className="font-[family-name:var(--font-inter)] font-medium text-[14px] leading-[20px] text-[#414651]">
            Add a link
          </label>

          <div className="flex gap-[8px]">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Website, Notion, Drive folder, public case study"
              className="flex-1 h-[44px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] shadow-xs font-[family-name:var(--font-dm-sans)] text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] outline-none focus:border-[#155eef] transition-colors"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="w-[63px] h-[44px] bg-[#155eef] text-white font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] rounded-[8px] hover:bg-[#1249c4] transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Added links list */}
          {links.length > 0 && (
            <div className="flex flex-col gap-[8px] mt-[8px]">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#f5f5f6] rounded-[8px] h-[48px] px-[12px]"
                >
                  {/* Left side: icon + link */}
                  <div className="flex items-center gap-[8px] min-w-0 flex-1">
                    <LinkIcon className="w-[16px] h-[16px] text-[#155eef] flex-shrink-0" />
                    <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#155eef] truncate">
                      {link.url}
                    </span>
                  </div>

                  {/* Right side: visible checkbox + remove */}
                  <div className="flex items-center gap-[12px] flex-shrink-0 ml-[12px]">
                    <label className="flex items-center gap-[6px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={link.visible}
                        onChange={() => handleToggleVisibility(index)}
                        className="w-[16px] h-[16px] rounded-[4px] border border-[#d5d7da] accent-[#155eef] cursor-pointer"
                      />
                      <span className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#414651]">
                        Visible
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] text-[#dc2626] hover:text-[#b91c1c] transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Visibility settings */}
      <div className="flex flex-col gap-[6px]">
        <h3 className="font-[family-name:var(--font-dm-sans)] font-medium text-[20px] leading-[30px] text-[#181d27]">
          Visibility settings
        </h3>
        <p className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]">
          Visible items appear on your public profile. Private items are used for verification only.
        </p>
      </div>
    </div>
  );
}
