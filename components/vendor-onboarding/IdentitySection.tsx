'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Globe, Loader2, Trash2, Upload, User } from 'lucide-react';
import {
  deleteUserProfilePicture,
  getUserProfilePicture,
  notifyUserProfilePictureChanged,
  uploadUserProfilePicture,
} from '@/features/users/client';
import { socialUrlError } from '@/features/experts/social-links';
import type { SocialLinkEntry, VendorOnboardingData } from '@/hooks/types/vendor-contracts';

interface IdentitySectionProps {
  formData: VendorOnboardingData;
  setFormData: (data: VendorOnboardingData) => void;
  readOnly?: boolean;
}

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const PHOTO_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';

const accountTypes = [
  {
    value: 'individual',
    title: 'Individual',
    subtitle: 'Freelancer or solo consultant',
  },
  {
    value: 'business',
    title: 'Business or team',
    subtitle: 'Agency, studio, or multi-person team',
  },
];

/** Initials once a name exists; a standard person glyph before that. */
function AvatarFallback({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return <User size={26} strokeWidth={1.6} />;
  return <>{parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')}</>;
}

/**
 * Profile photo lives on the user row (the server copies it onto the expert
 * row), so this uses the generic user picture endpoints and the same change
 * event the nav avatar listens for.
 */
function ProfilePhotoField({ displayName, readOnly }: { displayName: string; readOnly?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    void getUserProfilePicture().then((result) => {
      if (!active) return;
      if (result.ok && result.data.size > 0) {
        objectUrl = URL.createObjectURL(result.data);
        setPhotoUrl(objectUrl);
      } else {
        setPhotoUrl(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const replacePhotoUrl = (next: string | null) => {
    setPhotoUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return next;
    });
  };

  const handleFile = async (file: File | null) => {
    if (!file || busy) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file (PNG, JPG, WebP or GIF).');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError('Profile photos must be 10 MB or smaller.');
      return;
    }
    setBusy(true);
    try {
      const result = await uploadUserProfilePicture(file);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      replacePhotoUrl(URL.createObjectURL(file));
      notifyUserProfilePictureChanged();
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      const result = await deleteUserProfilePicture();
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      replacePhotoUrl(null);
      notifyUserProfilePictureChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pp-field">
      <label>
        <span
          className="vo-label-tip"
          data-tip="Shown on your expert card and in search results. Square, at least 400 px."
        >Profile photo</span>
      </label>

      <div className="vo-photo">
        <span className="vo-photo-preview" aria-hidden>
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" />
          ) : (
            <AvatarFallback name={displayName} />
          )}
        </span>

        <div className="pp-stack pp-gap-2">
          <div className="pp-row pp-gap-2" style={{ flexWrap: 'wrap' }}>
            <button
              type="button"
              className="pp-btn pp-btn--secondary pp-btn--sm"
              onClick={() => inputRef.current?.click()}
              disabled={busy || readOnly}
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {photoUrl ? 'Replace photo' : 'Upload photo'}
            </button>
            {photoUrl && (
              <button
                type="button"
                className="pp-btn pp-btn--ghost pp-btn--sm"
                onClick={() => void handleRemove()}
                disabled={busy || readOnly}
              >
                <Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
          <p className="pp-small">PNG, JPG, WebP or GIF. Max 10 MB.</p>
          <input
            ref={inputRef}
            type="file"
            accept={PHOTO_ACCEPT}
            className="hidden"
            onChange={(event) => {
              void handleFile(event.target.files?.[0] ?? null);
              event.currentTarget.value = '';
            }}
          />
        </div>
      </div>

      {error && <p className="vo-error">{error}</p>}
    </div>
  );
}

export default function IdentitySection({ formData, setFormData, readOnly = false }: IdentitySectionProps) {
  // The website lives in socialLinks (platform "website") so the profile,
  // the directory and the mapper keep one source; this is just where we ask.
  const website = (formData.socialLinks ?? []).find((link) => link.platform === 'website')?.url ?? '';
  const websiteError = socialUrlError('website', website);
  const setWebsite = (url: string) => {
    const others = (formData.socialLinks ?? []).filter((link) => link.platform !== 'website');
    const next: SocialLinkEntry[] = url.trim() === '' ? others : [{ platform: 'website', url }, ...others];
    setFormData({ ...formData, socialLinks: next });
  };

  const selectedType = formData.accountType ?? '';

  return (
    <div className="vo-step">
      <ProfilePhotoField displayName={formData.displayName} readOnly={readOnly} />

      <div className="pp-field">
        <label>
          Account type <span className="vo-req">*</span>
        </label>

        <div className="pp-flex pp-gap-3 vo-choice-row">
          {accountTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              aria-pressed={selectedType === type.value}
              onClick={() => setFormData({ ...formData, accountType: type.value })}
              className="vo-choice"
              disabled={readOnly}
            >
              <span className="vo-choice-title">{type.title}</span>
              <span className="vo-choice-sub">{type.subtitle}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pp-field">
        <label htmlFor="vo-display-name">
          <span
            className="vo-label-tip"
            data-tip="How you appear on your profile and in the directory."
          >Public display name</span> <span className="vo-req">*</span>
        </label>
        <input
          id="vo-display-name"
          className="pp-input"
          type="text"
          value={formData.displayName}
          onChange={(event) => setFormData({ ...formData, displayName: event.target.value })}
          placeholder={formData.accountType === 'business' ? 'Northwind Consulting' : 'Priya Raman'}
          disabled={readOnly}
        />
      </div>

      <div className="pp-field">
        <label htmlFor="vo-headline">
          <span
            className="vo-label-tip"
            data-tip="One line under your name. Say the product, the client type and the proof."
          >Professional headline</span> <span className="vo-req">*</span>
        </label>
        <input
          id="vo-headline"
          className="pp-input"
          type="text"
          value={formData.headline}
          onChange={(event) => setFormData({ ...formData, headline: event.target.value })}
          placeholder="HubSpot CRM migrations for B2B SaaS, 40+ portals"
          disabled={readOnly}
        />
      </div>

      <div className="pp-field">
        <label htmlFor="vo-website">Website</label>
        <div className="vo-social-input">
          <span className="vo-social-ico" aria-hidden><Globe size={16} /></span>
          <input
            id="vo-website"
            className="pp-input"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            placeholder="https://northwindconsulting.com"
            aria-invalid={Boolean(websiteError) || undefined}
            disabled={readOnly}
          />
        </div>
        {websiteError && <p className="vo-error">{websiteError}</p>}
      </div>
    </div>
  );
}
