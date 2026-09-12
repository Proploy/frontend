'use client'

import Link from 'next/link';
import { AlertCircle, CheckCircle2, Clock, Loader2, RotateCcw } from 'lucide-react';
import type { ExpertApplicationStatus, ExpertProgress } from '@/features/experts/types';

interface StatusBannerProps {
  status: ExpertApplicationStatus | null;
  progress: ExpertProgress | null;
  submittedAt?: string | null;
  onRestore?: () => void;
  restoring?: boolean;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Stage banner above the wizard. Only the stages that need a message render;
 * a plain draft shows nothing here.
 */
export default function StatusBanner({ status, progress, submittedAt, onRestore, restoring }: StatusBannerProps) {
  if (status === 'changes_requested') {
    const request = progress?.changeRequests?.[0] ?? null;
    return (
      <div className="vo-banner vo-banner--danger" role="alert">
        <AlertCircle size={18} />
        <div className="vo-banner-body">
          <p style={{ fontWeight: 'var(--weight-medium)' }}>
            The review team requested changes{request ? ` on ${formatDate(request.createdAt)}` : ''}.
          </p>
          {request?.notes ? (
            <p className="vo-banner-note">{request.notes}</p>
          ) : (
            <p>Update the sections below and submit again.</p>
          )}
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    const request = progress?.changeRequests?.[0] ?? null;
    return (
      <div className="vo-banner vo-banner--danger" role="alert">
        <AlertCircle size={18} />
        <div className="vo-banner-body">
          <p style={{ fontWeight: 'var(--weight-medium)' }}>This application was closed.</p>
          {request?.notes ? <p className="vo-banner-note">{request.notes}</p> : null}
          <p>You can restore it as a draft, edit, and submit again.</p>
          {onRestore && (
            <button
              type="button"
              className="pp-btn pp-btn--secondary pp-btn--sm"
              onClick={onRestore}
              disabled={restoring}
              style={{ alignSelf: 'flex-start' }}
            >
              {restoring ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
              Restore and edit
            </button>
          )}
        </div>
      </div>
    );
  }

  if (status === 'submitted') {
    return (
      <div className="vo-banner vo-banner--info" role="status">
        <Clock size={18} />
        <div className="vo-banner-body">
          <p style={{ fontWeight: 'var(--weight-medium)' }}>
            In review{submittedAt ? ` since ${formatDate(submittedAt)}` : ''} — you can still edit.
          </p>
          <p>Changes you save now are what the review team sees.</p>
        </div>
      </div>
    );
  }

  if (status === 'approved') {
    return (
      <div className="vo-banner vo-banner--success" role="status">
        <CheckCircle2 size={18} />
        <div className="vo-banner-body">
          <p style={{ fontWeight: 'var(--weight-medium)' }}>Your expert profile is live.</p>
          <p>
            This application is read-only now. Head to your{' '}
            <Link href="/workspace">workspace</Link> or edit your{' '}
            <Link href="/profile">public profile</Link>.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
