'use client'

import { Star, X } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { readScreenshot, screenshotProblem, submitFeedback } from './client'
import {
  FEEDBACK_AREAS,
  FEEDBACK_CATEGORIES,
  MESSAGE_MAX_CHARS,
  MESSAGE_MIN_CHARS,
  SCREENSHOT_TYPES,
  type FeedbackArea,
  type FeedbackCategory,
} from './types'

type Phase = 'editing' | 'sending' | 'sent'

function describeError(failure: NormalizedError): string {
  if (failure.status === 429) return 'Too many submissions right now. Please try again in a minute.'
  if (failure.status === 400 || failure.status === 422) {
    return failure.error.message || 'Please check the form and try again.'
  }
  if (failure.status === 0) return 'We could not reach Proploy. Check your connection and try again.'
  return 'Something went wrong on our side. Please try again.'
}

export function FeedbackForm({ formId, onPhaseChange }: {
  formId: string
  onPhaseChange: (phase: Phase) => void
}) {
  const { user } = useAuth()
  const fieldId = useId()

  const [phase, setPhase] = useState<Phase>('editing')
  const [category, setCategory] = useState<FeedbackCategory>('bug')
  const [area, setArea] = useState<FeedbackArea | ''>('')
  const [rating, setRating] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [canContact, setCanContact] = useState(false)
  const [website, setWebsite] = useState('')
  const [screenshot, setScreenshot] = useState<{ file: File; previewUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => onPhaseChange(phase), [phase, onPhaseChange])

  // Each preview URL is released when it is replaced, removed, or unmounted.
  useEffect(() => {
    if (!screenshot) return
    return () => URL.revokeObjectURL(screenshot.previewUrl)
  }, [screenshot])

  const trimmedLength = message.trim().length
  const needsEmail = !user && canContact

  function reset() {
    setCategory('bug')
    setArea('')
    setRating(null)
    setMessage('')
    setCanContact(false)
    setScreenshot(null)
    setError(null)
    setPhase('editing')
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (phase === 'sending') return
    if (trimmedLength < MESSAGE_MIN_CHARS) {
      setError(`Please write at least ${MESSAGE_MIN_CHARS} characters.`)
      return
    }
    if (needsEmail && !email.trim()) {
      setError('Add your email so we can reply.')
      return
    }

    setError(null)
    setPhase('sending')
    const result = await submitFeedback({
      category,
      area: area || null,
      rating,
      message: message.trim(),
      email: user ? null : email.trim() || null,
      canContact,
      pageUrl: `${window.location.origin}${window.location.pathname}${window.location.search}`,
      website: website || null,
      attachment: screenshot ? await readScreenshot(screenshot.file) : null,
    })
    if (result.ok) {
      setPhase('sent')
    } else {
      setError(describeError(result))
      setPhase('editing')
    }
  }

  if (phase === 'sent') {
    return (
      <div className="pp-stack pp-gap-4 items-center py-10 text-center" role="status">
        <span className="pp-tile pp-tile--soft" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 13 4 4 10-10" />
          </svg>
        </span>
        <p className="pp-h5">Thanks, we got it</p>
        <p className="pp-body max-w-[38ch]">
          Every note is read by the Proploy team.{canContact ? ' We will reply by email if we need more detail.' : ''}
        </p>
        <button type="button" className="pp-btn pp-btn--soft pp-btn--sm pp-btn--pill pp-btn--inline" onClick={reset}>
          Send more feedback
        </button>
      </div>
    )
  }

  return (
    <form id={formId} className="pp-stack pp-gap-5" onSubmit={onSubmit} noValidate>
      <fieldset className="pp-stack pp-gap-2">
        <legend className="mb-2 text-[13px] font-medium text-[var(--ink)]">What kind of feedback?</legend>
        <div className="flex flex-wrap gap-2">
          {FEEDBACK_CATEGORIES.map(option => (
            <button
              key={option.value}
              type="button"
              className="pp-chip"
              aria-pressed={category === option.value}
              onClick={() => setCategory(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="pp-field">
        <label htmlFor={`${fieldId}-area`}>Which area? <span className="text-[var(--ink-soft)]">(optional)</span></label>
        <select
          id={`${fieldId}-area`}
          className="pp-select"
          value={area}
          onChange={event => setArea(event.target.value as FeedbackArea | '')}
        >
          <option value="">Choose an area</option>
          {FEEDBACK_AREAS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="mb-2 text-[13px] font-medium text-[var(--ink)]">
          How is your experience so far? <span className="text-[var(--ink-soft)]">(optional)</span>
        </legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              aria-label={`${value} out of 5`}
              aria-pressed={rating === value}
              onClick={() => setRating(rating === value ? null : value)}
              className="rounded-md p-1 text-[var(--cobalt)] hover:bg-[var(--cobalt-soft)]"
            >
              <Star size={22} fill={rating !== null && value <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
      </fieldset>

      <div className="pp-field">
        <label htmlFor={`${fieldId}-message`}>Your feedback</label>
        <textarea
          id={`${fieldId}-message`}
          className="pp-textarea"
          required
          minLength={MESSAGE_MIN_CHARS}
          maxLength={MESSAGE_MAX_CHARS}
          value={message}
          onChange={event => setMessage(event.target.value)}
          placeholder={category === 'bug' ? 'What happened, and what did you expect?' : 'Tell us what you think'}
        />
        <p className="pp-small text-right text-[var(--ink-soft)]">{trimmedLength}/{MESSAGE_MAX_CHARS}</p>
      </div>

      <div className="pp-field">
        <label htmlFor={`${fieldId}-shot`}>Screenshot <span className="text-[var(--ink-soft)]">(optional, PNG/JPEG/WebP, up to 5 MB)</span></label>
        {screenshot ? (
          <div className="flex items-center gap-3 rounded-[var(--r-control)] border border-[var(--line)] p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
            <img src={screenshot.previewUrl} alt="" className="h-14 w-20 rounded object-cover" />
            <span className="pp-small min-w-0 flex-1 truncate">{screenshot.file.name}</span>
            <button
              type="button"
              aria-label="Remove screenshot"
              className="rounded-md p-1.5 text-[var(--ink-soft)] hover:bg-[#f2f4f7]"
              onClick={() => setScreenshot(null)}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <input
            id={`${fieldId}-shot`}
            type="file"
            accept={SCREENSHOT_TYPES.join(',')}
            className="pp-input"
            onChange={event => {
              const file = event.target.files?.[0] ?? null
              event.target.value = ''
              if (!file) return
              const problem = screenshotProblem(file)
              setError(problem)
              if (!problem) setScreenshot({ file, previewUrl: URL.createObjectURL(file) })
            }}
          />
        )}
      </div>

      {user ? (
        <p className="pp-small text-[var(--ink-soft)]">Sending as {user.email ?? 'your account'}.</p>
      ) : (
        <div className="pp-field">
          <label htmlFor={`${fieldId}-email`}>
            Email <span className="text-[var(--ink-soft)]">{needsEmail ? '(required to reply)' : '(optional)'}</span>
          </label>
          <input
            id={`${fieldId}-email`}
            type="email"
            autoComplete="email"
            className="pp-input"
            required={needsEmail}
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="you@company.com"
          />
        </div>
      )}

      <label className="pp-check">
        <input type="checkbox" checked={canContact} onChange={event => setCanContact(event.target.checked)} />
        You can contact me about this feedback
      </label>

      {/* Honeypot: off-screen and out of the tab order, so only bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${fieldId}-website`}>Website</label>
        <input
          id={`${fieldId}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={event => setWebsite(event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="pp-small rounded-[var(--r-control)] bg-[#fef3f2] px-3 py-2 text-[#b42318]">
          {error}
        </p>
      )}
    </form>
  )
}
