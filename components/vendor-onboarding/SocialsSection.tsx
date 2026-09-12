'use client'

import { Check, Dribbble, Github, Globe, Link2, Linkedin, Twitter, Youtube } from 'lucide-react';
import type { ReactNode } from 'react';
import { SOCIAL_PLATFORM_RULES, socialUrlError } from '@/features/experts/social-links';
import type { SocialPlatform } from '@/features/experts/types';
import type { SocialLinkEntry, VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface SocialsSectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  readOnly?: boolean;
}

const ICONS: Record<SocialPlatform, ReactNode> = {
  linkedin: <Linkedin size={16} />,
  website: <Globe size={16} />,
  github: <Github size={16} />,
  twitter: <Twitter size={16} />,
  youtube: <Youtube size={16} />,
  dribbble: <Dribbble size={16} />,
  behance: <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '-0.02em' }} aria-hidden>Be</span>,
  other: <Link2 size={16} />,
};

/** The website is asked in the identity section, so it is not repeated here. */
const ROWS = SOCIAL_PLATFORM_RULES.filter((rule) => rule.platform !== 'website');

/**
 * One row per platform, in a fixed order. The value for a platform is the
 * first matching entry in `socialLinks`; empty rows are simply not stored.
 * Each box accepts only its own platform's host (see social-links.ts).
 */
export default function SocialsSection({ formData, setFormData, readOnly = false }: SocialsSectionProps) {
  const links = formData.socialLinks ?? [];

  const valueFor = (platform: SocialPlatform) => links.find((link) => link.platform === platform)?.url ?? '';

  const setValue = (platform: SocialPlatform, url: string) => {
    const others = links.filter((link) => link.platform !== platform);
    const next: SocialLinkEntry[] = url.trim() === '' ? others : [...others, { platform, url }];
    // Keep the fixed display order so the mapper and the review summary agree.
    const order = SOCIAL_PLATFORM_RULES.map((rule) => rule.platform);
    next.sort((a, b) => order.indexOf(a.platform) - order.indexOf(b.platform));
    setFormData({ ...formData, socialLinks: next });
  };

  return (
    <div className="vo-step">
      <p className="pp-small">Buyers see these on your profile. Add the ones you keep current.</p>

      <div className="pp-stack pp-gap-3">
        {ROWS.map((rule) => {
          const value = valueFor(rule.platform);
          const error = socialUrlError(rule.platform, value);
          const valid = value.trim() !== '' && !error;
          const inputId = `vo-social-${rule.platform}`;
          return (
            <div key={rule.platform} className="vo-social">
              <label htmlFor={inputId} className="vo-social-name">
                {ICONS[rule.platform]}
                {rule.label}
              </label>
              <div className="pp-stack" style={{ gap: 4 }}>
                <div className="vo-social-input">
                  <span className="vo-social-ico" data-valid={valid || undefined} aria-hidden>
                    {valid ? <Check size={16} /> : ICONS[rule.platform]}
                  </span>
                  <input
                    id={inputId}
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    className="pp-input"
                    placeholder={rule.placeholder}
                    value={value}
                    onChange={(event) => setValue(rule.platform, event.target.value)}
                    aria-invalid={Boolean(error) || undefined}
                    data-valid={valid || undefined}
                    disabled={readOnly}
                  />
                </div>
                {error && <p className="vo-error">{error}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
