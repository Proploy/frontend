# Workspace Notifications and State Corrections

Date: 2026-07-29

## Purpose

Correct four related workspace behaviors without introducing fixed US locale
formatting:

1. Proposal edit forms must always show the selected proposal's values.
2. Home recent-activity rows must navigate to the relevant workspace area.
3. Workspace notifications must open in a shared top modal, persist read state,
   update in real time, and navigate from an individual notification to its
   source area.
4. Resend email delivery must run through a safe, retryable worker and must
   never be reported as delivered when Resend is not configured.
5. Workspace success, information, and error nudges must use the existing
   universal foreground toast at the bottom center instead of page-level
   banners at the top.
6. The universal Ask Proploy launcher must not cover workspace actions; on
   desktop it reveals only when the pointer reaches the bottom-right corner.

The existing notification outbox remains the source for both in-app
notifications and transactional email. In-app read state and email delivery
state are independent properties of the same recipient-targeted event.

## Scope

### Included

- Recipient-relevant notifications for proposal sent/accepted/declined,
  contract actions, invoices, and messages.
- Persistent single-notification and mark-all-read behavior.
- A shared notification modal available from the workspace shell.
- Realtime insertion of newly created notification events.
- Links from notifications and Home recent activity to the relevant workspace
  page.
- Proposal editor state isolation when switching records.
- Locale-aware user-visible slot formatting.
- Locale-independent Google Calendar timestamp serialization.
- Resend configuration validation, worker startup, retry behavior, and
  duplicate-send protection.
- Migration of workspace action feedback to the universal bottom-center toast.
- A non-obstructive desktop activation zone for the Ask Proploy launcher.

### Excluded

- Notifications for a user's own draft creation or routine self-authored edits.
- Push notifications, SMS, or additional email providers.
- A standalone `/workspace/notifications` page.
- Storing locale preferences in the user profile. The browser/OS locale is the
  display-language source for this change.
- Adding new third-party dependencies.

## Design

### 1. Notification data model

`workspace.notification_event` keeps its existing email-delivery fields:

- `status`: `pending`, `processing`, `sent`, `failed`, or `dead_letter`
- `attempts`
- `lastAttemptAt`
- `sentAt`
- `errorMessage`
- `providerMessageId`

The table gains fields with separate responsibilities:

- `readAt`: nullable timestamp for in-app read state
- `processingStartedAt`: nullable timestamp used to recover abandoned claims

`readAt` never changes email delivery state. Email delivery transitions never
change `readAt`.

The existing `toUserId` remains the ownership boundary for in-app reads and
realtime delivery. Events without `toUserId` can still be delivered by email
but are not exposed as another user's in-app notification.

### 2. Notification API

The authenticated notification list response adds:

- `readAt`
- a rendered in-app `title`
- a short rendered `body`
- an optional workspace-relative `href`

Rendering is centralized in the backend so the browser does not maintain a
second template-to-copy or template-to-route map.

New user-scoped mutations:

- `PATCH /api/v1/workspace/notifications/{notification_id}/read`
- `PATCH /api/v1/workspace/notifications/me/read-all`

The service verifies `toUserId` against the authenticated Supabase user ID.
Users cannot read or mutate another recipient's events. Marking an already-read
event is idempotent.

The list endpoint returns recipient events newest first. Unread count is based
only on `readAt is null`, never on email `status`.

### 3. Notification destinations

Each supported template maps to the closest relevant workspace destination:

- proposals: `/workspace/proposals`
- contracts: `/workspace/contracts`
- invoices: `/workspace/invoices`
- messages: `/workspace/messages`

Where the target page has a stable selection mechanism, the notification may
include a query parameter containing the source record ID. A missing source ID
falls back to the section page. No notification links to
`/workspace/notifications`.

### 4. Shared workspace notification modal

`WorkspaceShell` owns a notification controller/provider that:

1. loads `/api/v1/workspace/notifications/me`;
2. derives unread count from `readAt`;
3. subscribes through the existing Supabase Realtime hook;
4. inserts or replaces realtime events by ID;
5. exposes `openNotifications()` to workspace children;
6. marks an item read before navigating;
7. supports persistent mark-all-read.

The workspace shell passes the live notification collection into a controlled
notification modal in `DashboardChrome`. The desktop sidebar bell and mobile
header bell open the same modal state.

The Home `Notifications` button calls `openNotifications()` and does not
navigate. The Home “All events” action is removed or changed to open the same
modal. Empty, loading, error, and no-unread states are explicit.

The modal traps interaction visually above the current workspace page, closes
on Escape or backdrop click, and restores focus to the trigger. Individual
items remain keyboard-accessible links.

### 5. Realtime behavior

The existing realtime configuration endpoint remains user-bound and
auth-gated. New outbox inserts are delivered only when `toUserId` matches the
authenticated user.

Realtime inserts enter the modal as unread. The client deduplicates by event
ID. If realtime is unavailable, initial HTTP loading still provides complete
durable state on the next refresh.

### 6. Resend delivery worker

Resend remains the only email provider. Configuration uses deployment secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_ADDRESS`
- `RESEND_WEBHOOK_SECRET` when delivery webhooks are enabled
- an explicit email-delivery enablement flag

Behavior:

- When email delivery is enabled, startup requires a Resend API key and sender
  address. Invalid configuration fails clearly instead of silently marking
  events sent.
- When email delivery is disabled for local development, the worker does not
  claim events. Events remain pending and are still available in-app.
- Tests use an explicit fake transport; absence of a key is not treated as a
  successful delivery.
- The FastAPI lifespan starts one cancellable polling loop per process only
  when delivery is enabled.
- Claims are atomic. A worker changes a row from `pending` to `processing`
  before sending so concurrent workers cannot send the same row.
- Successful Resend responses transition `processing` to `sent`.
- Retryable failures return the event to `pending` and increment attempts.
- Exhausted retries transition to `dead_letter`.
- Stale `processing` claims are recoverable after a bounded timeout.

This design preserves the existing best-effort rule: enqueue failure must not
roll back the business action that created the notification.

### 7. Proposal editor state

The proposal detail/editor is keyed by proposal ID or otherwise explicitly
reset whenever the selected proposal changes. Switching records discards
unsaved edits from the previous record and initializes every field from the
newly selected proposal.

Saving continues to update only the selected proposal. The regression test
selects two proposals with different values and verifies that the second
proposal never displays the first proposal's edit state.

### 8. Home recent activity

Recent-activity data already provides an optional `href`. Each row renders as a
Next.js link when `href` exists and remains plain content otherwise. The full
row is the hit target and has visible keyboard focus.

Recent activity remains a chronological resource summary. It does not create
notifications by itself. Only backend-created, recipient-targeted notification
events raise alerts.

### 9. Locale and calendar formatting

User-visible slot dates continue to use `Intl.DateTimeFormat` with the
browser/OS locale and the requested IANA timezone. Tests derive expectations
from the active locale instead of asserting US month/day order.

Google Calendar event timestamps are protocol values, not localized display
text. They are serialized from validated `Date` instances into canonical UTC
ISO basic form (`YYYYMMDDTHHmmssZ`). This requires no fixed locale, calendar,
or language. The optional `ctz` parameter continues to tell Google Calendar
which timezone to display.

JavaScript strings remain Unicode-safe. UTF-8 is the transport/source encoding;
`Intl.DateTimeFormat` is the locale-aware display formatter.

### 10. Universal workspace nudges

Workspace mutations use the existing `ActionToast` presentation for transient
success, information, and error feedback. It remains a foreground overlay
fixed at the bottom center, above workspace content.

The proposal acceptance confirmation shown in the supplied screenshot moves
from the full-width inline banner to `ActionToast`. Its primary message remains
visible in the toast. When a follow-up destination is useful, the toast model
supports an optional action label and workspace-relative action URL so the
user can open Messages without restoring an inline page banner.

The workspace uses one shared toast controller so individual pages do not
create competing fixed overlays. New workspace nudges call that controller;
static status badges and persistent error/empty states remain inline because
they are content rather than transient feedback.

### 11. Ask Proploy desktop launcher

The Ask Proploy chatbot remains universally available, but its desktop
launcher is hidden by default. A pointer entering the bottom-right corner of
the viewport reveals it without placing an invisible overlay over page
controls. The launcher stays visible while hovered or focused and hides after
the pointer leaves, unless the chatbot panel is open.

Keyboard focus reveals the launcher, preserving non-pointer access. On
touch/coarse-pointer layouts where hover is unavailable, the launcher remains
visible in its existing accessible form.

## Data flow

1. A recipient-relevant workspace action completes.
2. The service enqueues one `notification_event` containing recipient,
   template, payload, `status=pending`, and `readAt=null`.
3. Supabase Realtime delivers the insert to the matching signed-in recipient.
4. The workspace modal shows the event immediately as unread.
5. The email worker atomically claims the same event and sends it through
   Resend.
6. Resend delivery updates `status`; it does not affect `readAt`.
7. Opening an item or using mark-all-read updates `readAt` through an
   authenticated API.
8. Clicking an item closes the modal and navigates to its relevant workspace
   page.

## Error handling

- Notification list failure shows a non-blocking modal error with retry.
- Read mutations update optimistically only when rollback is possible; failed
  mutations restore unread state and show an error.
- Realtime failure does not block HTTP-loaded notifications.
- Missing Resend configuration never consumes pending events.
- Resend network and non-2xx failures follow retry/dead-letter rules.
- Unsupported templates use safe generic in-app copy and no destination.
- Missing or malformed payload identifiers fall back to a section-level route.
- Toast actions are optional; a missing action destination still presents and
  dismisses the nudge normally.

## Security

- Every list/read mutation is authenticated.
- Ownership comes from the JWT user ID, never a request-provided recipient ID.
- Realtime filtering remains server-generated.
- Resend keys and webhook secrets are never returned to the browser or written
  into repository files.
- Logs redact recipient email addresses and do not emit notification payloads
  that may contain message previews.

## Verification

### Frontend

- Proposal selection regression test.
- Notification response mapping and route tests.
- Modal open/close, mark-one, mark-all, and navigation tests.
- Realtime deduplication test.
- Recent-activity link test.
- Universal workspace toast placement, action, dismissal, and replacement of
  the proposal acceptance banner.
- Ask Proploy bottom-right pointer activation, hover retention, keyboard focus,
  and touch fallback tests.
- Slot-format test under at least `en-IN` and a non-Latin locale.
- Google Calendar timestamp test without any fixed US locale.
- Typecheck, lint, and the frontend QA runbook.

### Service API

- Migration upgrade/downgrade assertions.
- User ownership tests for mark-one and mark-all.
- `readAt` independence from email `status`.
- Atomic claim and stale-claim recovery tests.
- Missing Resend configuration test.
- Resend success, retry, and dead-letter transition tests.
- Recipient-event coverage for proposals, contracts, invoices, and messages.
- Service API unit suite and QA runbook.

## Deployment

1. Apply the notification migration.
2. Configure the verified Resend sender domain/address.
3. Store `RESEND_API_KEY` and related values in the deployment secret manager.
4. Enable email delivery only after the sender is verified.
5. Deploy service-apis and verify worker startup without exposing secrets.
6. Send a controlled test notification and confirm both:
   - in-app unread/read persistence;
   - Resend provider message ID and delivered email.
7. Deploy the frontend modal and navigation changes.

Rollback can disable email delivery without removing queued events. Frontend
rollback leaves the extended API fields harmless. Database rollback is safe
only after code no longer writes `readAt`, `processingStartedAt`, or
`processing` status.
