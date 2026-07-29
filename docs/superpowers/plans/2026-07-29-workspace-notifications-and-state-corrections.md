# Workspace Notifications and State Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver durable recipient notifications with a shared modal and safe Resend delivery while correcting proposal form state, activity navigation, workspace nudges, and locale-dependent formatting.

**Architecture:** Extend `workspace.notification_event` with independent in-app read state and atomic email-claim state. Expose user-owned read mutations and backend-rendered notification presentation, then consume them through one workspace experience provider that controls the modal, realtime refresh, unread badge, and universal toast. Keep user-visible date formatting locale-aware and serialize calendar protocol timestamps directly from UTC ISO values.

**Tech Stack:** Next.js 14, React, TypeScript, Vitest, FastAPI, Pydantic, SQLAlchemy async, Alembic, PostgreSQL, Supabase Realtime, Resend, pytest.

## Global Constraints

- No fixed US locale for user-visible or protocol date formatting.
- Browser/OS locale controls visible language; requested IANA timezone controls displayed time.
- Only recipient-relevant events raise notifications.
- `readAt` and email delivery `status` are independent.
- No `/workspace/notifications` page or navigation.
- Resend secrets stay outside repository files.
- Missing Resend configuration never marks an email delivered.
- No new dependencies.
- Ask before implementation commits.

---

### Task 1: Durable notification schema and ownership-safe read API

**Files:**
- Create: `service-apis/alembic/versions/037_notification_read_and_delivery_claims.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/db_models.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/enums.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/models.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/service.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/router.py`
- Test: `service-apis/tests/workspace/test_notification_read_state.py`
- Test: `service-apis/tests/migrations/test_notification_read_migration.py`

**Interfaces:**
- Produces: `NotificationEvent.readAt`, `NotificationEvent.processingStartedAt`.
- Produces: `NotificationService.mark_read(event_id: str, user_id: str)`.
- Produces: `NotificationService.mark_all_read(user_id: str) -> int`.
- Produces: `PATCH /api/v1/workspace/notifications/{notification_id}/read`.
- Produces: `PATCH /api/v1/workspace/notifications/me/read-all`.

- [ ] **Step 1: Write failing migration and read-state tests**

```python
def test_notification_read_migration_adds_independent_state() -> None:
    migration = Path("alembic/versions/037_notification_read_and_delivery_claims.py").read_text()
    assert 'ADD COLUMN IF NOT EXISTS "readAt" timestamp' in migration
    assert 'ADD COLUMN IF NOT EXISTS "processingStartedAt" timestamp' in migration
    assert "'processing'" in migration

@pytest.mark.asyncio
async def test_mark_read_is_scoped_to_authenticated_recipient() -> None:
    service = NotificationService()
    service._mark_read_for_user = AsyncMock(return_value=None)
    await service.mark_read(event_id="event-1", user_id="user-1")
    service._mark_read_for_user.assert_awaited_once_with(
        event_id="event-1",
        user_id="user-1",
    )
```

- [ ] **Step 2: Run tests and confirm expected failures**

Run:

```bash
uv run pytest tests/migrations/test_notification_read_migration.py tests/workspace/test_notification_read_state.py -x -v
```

Expected: failure because revision 037, read columns, and read mutations do not exist.

- [ ] **Step 3: Implement migration and model fields**

Add nullable `readAt` and `processingStartedAt`, extend the delivery-status
constraint with `processing`, and create indexes for recipient unread reads and
delivery claims. Downgrade removes the indexes/columns and restores the
original status constraint after converting any `processing` row to `pending`.

- [ ] **Step 4: Implement authenticated read mutations**

Use a single SQL update constrained by both event ID and `toUserId`:

```python
update(NotificationEvent)
.where(
    NotificationEvent.id == event_id,
    NotificationEvent.toUserId == user_id,
)
.values(readAt=_utc_now())
```

Raise `NotFoundError` when no owned event is updated. Mark-all updates only
rows for `user_id` where `readAt IS NULL` and returns the affected count.

- [ ] **Step 5: Run focused tests**

Run:

```bash
uv run pytest tests/migrations/test_notification_read_migration.py tests/workspace/test_notification_read_state.py -v
```

Expected: all focused tests pass.

- [ ] **Step 6: Commit only after explicit user approval**

Suggested commit:

```bash
git add alembic/versions/037_notification_read_and_delivery_claims.py src/proploy_service_apis/modules/workspace/notification tests/migrations/test_notification_read_migration.py tests/workspace/test_notification_read_state.py
git commit -m "feat(notifications): persist workspace read state"
```

### Task 2: Backend-rendered notification presentation

**Files:**
- Create: `service-apis/src/proploy_service_apis/modules/workspace/notification/presentation.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/models.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/router.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/worker.py`
- Test: `service-apis/tests/workspace/test_notification_presentation.py`
- Modify test: `service-apis/tests/workspace/test_notification.py`

**Interfaces:**
- Produces: `render_notification(template, payload) -> NotificationPresentation`.
- Produces response fields: `title`, `body`, `href`, `readAt`.
- Consumes notification payload IDs such as `proposalId`, `contractId`, `invoiceId`, and `conversationId`.

- [ ] **Step 1: Write failing presentation tests**

```python
@pytest.mark.parametrize(
    ("template", "payload", "href"),
    [
        ("proposal_sent", {"proposalId": "p1", "title": "Migration"}, "/workspace/proposals?proposal=p1"),
        ("contract_completed", {"contractId": "c1"}, "/workspace/contracts?contract=c1"),
        ("invoice_sent", {"invoiceId": "i1"}, "/workspace/invoices?invoice=i1"),
        ("message_received", {"conversationId": "m1"}, "/workspace/messages?conversation=m1"),
    ],
)
def test_notification_presentation_routes_to_source(template, payload, href) -> None:
    result = render_notification(template, payload)
    assert result.href == href
    assert result.title
    assert result.body
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:

```bash
uv run pytest tests/workspace/test_notification_presentation.py -x -v
```

Expected: import failure because `presentation.py` does not exist.

- [ ] **Step 3: Implement shared presentation**

Create a frozen dataclass:

```python
@dataclass(frozen=True)
class NotificationPresentation:
    title: str
    body: str
    href: str | None
```

Move `render_subject` and email-body rendering out of `worker.py` into this
module. Add in-app copy and routes for proposal, contract, invoice, and message
templates. Unknown templates receive safe generic copy and `href=None`.

- [ ] **Step 4: Add presentation to authenticated API responses**

`_to_response` derives presentation from the row's template/payload and
includes `readAt`. Do not expose a route based on arbitrary payload strings;
construct routes only from known template mappings and URL-encode record IDs.

- [ ] **Step 5: Run presentation and existing notification tests**

Run:

```bash
uv run pytest tests/workspace/test_notification_presentation.py tests/workspace/test_notification.py -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit only after explicit user approval**

Suggested commit:

```bash
git add src/proploy_service_apis/modules/workspace/notification tests/workspace/test_notification.py tests/workspace/test_notification_presentation.py
git commit -m "feat(notifications): render in-app notification content"
```

### Task 3: Safe Resend worker, configuration validation, and atomic claims

**Files:**
- Modify: `service-apis/.env.example`
- Modify: `service-apis/src/proploy_service_apis/core/config.py`
- Modify: `service-apis/src/proploy_service_apis/api/server.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/resend_client.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/service.py`
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/notification/worker.py`
- Test: `service-apis/tests/workspace/test_notification_worker.py`
- Modify test: `service-apis/tests/workspace/test_notification.py`

**Interfaces:**
- Produces setting: `notification_email_delivery_enabled: bool`.
- Produces: `validate_resend_configuration() -> None`.
- Produces: `NotificationService.claim_pending(limit: int) -> list[NotificationEvent]`.
- Produces: `NotificationService.recover_stale_claims() -> int`.
- Produces: `notification_worker_loop(stop_event: asyncio.Event)`.

- [ ] **Step 1: Write failing configuration and worker tests**

```python
def test_enabled_resend_requires_api_key(monkeypatch) -> None:
    monkeypatch.setattr(settings, "notification_email_delivery_enabled", True)
    monkeypatch.setattr(settings, "resend_api_key", "")
    with pytest.raises(RuntimeError, match="RESEND_API_KEY"):
        validate_resend_configuration()

@pytest.mark.asyncio
async def test_worker_does_not_claim_when_delivery_disabled(monkeypatch) -> None:
    monkeypatch.setattr(settings, "notification_email_delivery_enabled", False)
    service = MagicMock()
    service.claim_pending = AsyncMock()
    result = await run_once(service=service)
    service.claim_pending.assert_not_awaited()
    assert result["processed"] == 0
```

- [ ] **Step 2: Run tests and confirm expected failures**

Run:

```bash
uv run pytest tests/workspace/test_notification_worker.py tests/workspace/test_notification.py -x -v
```

Expected: failures because enabled validation, dependency-injected `run_once`,
and atomic claims do not exist.

- [ ] **Step 3: Replace implicit dry-run success**

`send_email` raises `ResendError("RESEND_API_KEY is not configured")` when
called without a key. Unit tests fake `send_email` explicitly. Add
`NOTIFICATION_EMAIL_DELIVERY_ENABLED=false` to `.env.example`.

- [ ] **Step 4: Implement atomic claims and stale recovery**

Within one transaction, select pending rows using
`FOR UPDATE SKIP LOCKED`, set `status=processing` and
`processingStartedAt=now`, commit, and return claimed rows. On retry return the
row to `pending`; on success/dead-letter clear `processingStartedAt`.

- [ ] **Step 5: Start and stop the worker in FastAPI lifespan**

Validate configuration before creating the polling task. Use an
`asyncio.Event` and cancel/await the task during shutdown. When delivery is
disabled, do not start the task and leave queued notifications pending.

- [ ] **Step 6: Run focused worker tests**

Run:

```bash
uv run pytest tests/workspace/test_notification_worker.py tests/workspace/test_notification.py -v
```

Expected: all tests pass without network access.

- [ ] **Step 7: Commit only after explicit user approval**

Suggested commit:

```bash
git add .env.example src/proploy_service_apis/core/config.py src/proploy_service_apis/api/server.py src/proploy_service_apis/modules/workspace/notification tests/workspace/test_notification.py tests/workspace/test_notification_worker.py
git commit -m "fix(notifications): make Resend delivery explicit and retry-safe"
```

### Task 4: Recipient message notifications

**Files:**
- Modify: `service-apis/src/proploy_service_apis/modules/workspace/conversation/service.py`
- Test: `service-apis/tests/workspace/test_conversation_notifications.py`

**Interfaces:**
- Consumes: `NotificationService.enqueue_notification`.
- Produces one `message_received` event per registered user participant except the sender.
- Payload: `conversationId`, `engagementId`, `senderName`, `preview`.

- [ ] **Step 1: Write failing message-recipient tests**

```python
@pytest.mark.asyncio
async def test_post_message_notifies_other_user_participants_only() -> None:
    service = ConversationService()
    service._notification_service.enqueue_notification = AsyncMock()
    service._notification_recipients = AsyncMock(
        return_value=[("buyer-1", "buyer@example.com")]
    )
    await service._enqueue_message_notifications(
        conversation_id="conv-1",
        engagement_id="eng-1",
        sender_user_id="expert-1",
        sender_name="Expert",
        body="A" * 300,
    )
    service._notification_service.enqueue_notification.assert_awaited_once()
    payload = service._notification_service.enqueue_notification.await_args.kwargs["payload"]
    assert payload["preview"] == "A" * 197 + "..."
```

- [ ] **Step 2: Run test and confirm it fails**

Run:

```bash
uv run pytest tests/workspace/test_conversation_notifications.py -x -v
```

Expected: failure because notification dependencies/helpers are absent.

- [ ] **Step 3: Implement best-effort recipient enqueue**

Resolve registered conversation participants and their emails, exclude the
sender, commit the message first, then enqueue outside the transaction.
Notification failure must not fail message creation. Idempotent nonce replay
returns the prior message without re-enqueueing.

- [ ] **Step 4: Run conversation notification tests**

Run:

```bash
uv run pytest tests/workspace/test_conversation_notifications.py tests/workspace/test_conversation.py -v
```

Expected: all tests pass.

- [ ] **Step 5: Commit only after explicit user approval**

Suggested commit:

```bash
git add src/proploy_service_apis/modules/workspace/conversation/service.py tests/workspace/test_conversation_notifications.py
git commit -m "feat(messages): notify conversation recipients"
```

### Task 5: Shared workspace notification modal and persistent unread state

**Files:**
- Create: `frontend/features/workspace/workspace-experience.tsx`
- Create: `frontend/features/workspace/workspace-notifications.test.tsx`
- Modify: `frontend/app/workspace/layout.tsx`
- Modify: `frontend/components/workspace/WorkspaceShell.tsx`
- Modify: `frontend/components/dashboard/NotificationsBell.tsx`
- Modify: `frontend/components/dashboard/DashboardChrome.tsx`
- Modify: `frontend/features/workspace/types.ts`
- Modify: `frontend/features/workspace/use-realtime-notifications.ts`
- Modify: `frontend/features/workspace/index.ts`

**Interfaces:**
- Produces: `WorkspaceExperienceProvider`.
- Produces: `useWorkspaceExperience()`.
- Produces controller methods: `openNotifications`, `closeNotifications`,
  `markNotificationRead`, `markAllNotificationsRead`, `showToast`.
- Consumes authenticated notification list/read endpoints and realtime inserts.

- [ ] **Step 1: Write failing provider/modal tests**

Test that:

```tsx
const experience = useWorkspaceExperience()
return <button onClick={experience.openNotifications}>Notifications</button>
```

opens a dialog containing API-loaded notifications, derives unread count from
`readAt`, marks one item before navigation, and marks all through the backend.
Assert no rendered anchor targets `/workspace/notifications`.

- [ ] **Step 2: Run test and confirm it fails**

Run:

```bash
npm test -- features/workspace/workspace-notifications.test.tsx
```

Expected: failure because the experience provider does not exist.

- [ ] **Step 3: Implement wire types and provider**

Use the backend response shape:

```ts
export interface WorkspaceNotification {
  id: string
  template: string
  status: NotificationStatus
  title: string
  body: string
  href?: string | null
  readAt?: string | null
  createdAt: string
}
```

Load authenticated notifications on mount. A realtime insert triggers a
debounced list refresh so presentation always comes from the backend. Replace
state by ID from the HTTP result to prevent duplicates.

- [ ] **Step 4: Make `NotificationsBell` controllable**

Retain uncontrolled behavior for existing expert/business fixtures. Add
optional controlled props for open state, persistent mark callbacks, loading,
error, and retry. Render one accessible top overlay/modal used by desktop and
mobile triggers.

- [ ] **Step 5: Mount provider in workspace layout and connect shell**

Wrap `WorkspaceRoleProvider` children with `WorkspaceExperienceProvider`.
`WorkspaceShell` passes live items and controller callbacks to
`DashboardChrome`.

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- features/workspace/workspace-notifications.test.tsx features/workspace/workspace-sidebar.test.tsx
```

Expected: tests pass and legacy dashboard notification fixtures remain usable.

- [ ] **Step 7: Commit only after explicit user approval**

Suggested commit:

```bash
git add app/workspace/layout.tsx components/dashboard components/workspace/WorkspaceShell.tsx features/workspace
git commit -m "feat(workspace): add persistent notification modal"
```

### Task 6: Home notification action and recent-activity navigation

**Files:**
- Modify: `frontend/app/workspace/page.tsx`
- Create: `frontend/features/workspace/recent-activity.test.tsx`
- Modify: `frontend/features/workspace/use-workspace-home.ts`

**Interfaces:**
- Consumes: `useWorkspaceExperience().openNotifications`.
- Consumes: `WorkspaceHomeActivity.href`.
- Produces fully clickable, keyboard-focusable activity rows.

- [ ] **Step 1: Write failing Home interaction tests**

Assert the Notifications button is a button rather than an anchor, invokes
`openNotifications`, and each activity with `href` renders a Next.js link to
that href.

- [ ] **Step 2: Run test and confirm it fails**

Run:

```bash
npm test -- features/workspace/recent-activity.test.tsx
```

Expected: failure because activity rows are plain list items and the
Notifications action still links to a missing page.

- [ ] **Step 3: Implement modal actions and activity links**

Replace both `/workspace/notifications` links with modal-opening buttons. Wrap
the full activity-row content in `Link` when `href` exists and retain plain
content otherwise. Use `focus-visible` styling.

- [ ] **Step 4: Remove fixed US currency formatting from activity details**

Use:

```ts
new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: i.currency || 'USD',
  maximumFractionDigits: 0,
}).format(i.totalCents / 100)
```

- [ ] **Step 5: Run focused tests**

Run:

```bash
npm test -- features/workspace/recent-activity.test.tsx
```

Expected: all tests pass.

- [ ] **Step 6: Commit only after explicit user approval**

Suggested commit:

```bash
git add app/workspace/page.tsx features/workspace/use-workspace-home.ts features/workspace/recent-activity.test.tsx
git commit -m "fix(workspace): make home activity actionable"
```

### Task 7: Proposal editor isolation and universal bottom-center nudge

**Files:**
- Modify: `frontend/components/ui/action-toast.tsx`
- Modify: `frontend/app/workspace/proposals/page.tsx`
- Create: `frontend/features/workspace/proposal-detail.test.tsx`
- Create: `frontend/components/ui/action-toast.test.tsx`

**Interfaces:**
- Consumes: `useWorkspaceExperience().showToast`.
- Extends: `ActionToastState` with optional `actionLabel` and `actionHref`.
- Produces proposal detail keyed by proposal ID.

- [ ] **Step 1: Write failing state-isolation and toast tests**

Render two proposals with different title, budget, summary, scope, and date.
Switch selection and assert every editor field displays the second proposal.
Assert acceptance feedback uses `.app-action-toast` and no full-width green
banner remains.

- [ ] **Step 2: Run tests and confirm expected failures**

Run:

```bash
npm test -- features/workspace/proposal-detail.test.tsx components/ui/action-toast.test.tsx
```

Expected: stale first-proposal values and missing toast action support.

- [ ] **Step 3: Reset proposal editor by identity**

Render:

```tsx
<ProposalDetail key={selected.id} proposal={selected} ... />
```

This discards unsaved values when selecting another proposal and initializes
the editor from the new record.

- [ ] **Step 4: Move activation feedback to universal toast**

Remove `activationMessage` and the inline banner. On accept/decline call
`showToast` with success/info copy. Acceptance includes:

```ts
{
  tone: 'success',
  title: 'Proposal accepted',
  body: 'Your shared messages and contract workspace are now available.',
  actionLabel: 'Open messages',
  actionHref: '/workspace/messages',
}
```

- [ ] **Step 5: Add optional toast action**

Render an accessible Next.js link inside `ActionToast` when both action fields
exist. Preserve fixed bottom-center positioning and automatic/manual dismissal.

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- features/workspace/proposal-detail.test.tsx components/ui/action-toast.test.tsx
```

Expected: all tests pass.

- [ ] **Step 7: Commit only after explicit user approval**

Suggested commit:

```bash
git add app/workspace/proposals/page.tsx components/ui/action-toast.tsx components/ui/action-toast.test.tsx features/workspace/proposal-detail.test.tsx
git commit -m "fix(workspace): isolate proposal edits and unify nudges"
```

### Task 8: Global locale display and locale-independent calendar serialization

**Files:**
- Modify: `frontend/features/native-scheduling/presentation.ts`
- Modify: `frontend/features/native-scheduling/presentation.test.ts`

**Interfaces:**
- Preserves: `formatNativeSlot(startsAt, endsAt, timezone)`.
- Preserves: `buildGoogleCalendarEventUrl(input)`.
- Produces canonical UTC basic timestamps from `Date.toISOString()`.

- [ ] **Step 1: Replace US-specific test with locale-derived assertions**

```ts
it('formats a slot using the runtime locale and requested timezone', () => {
  const start = new Date('2026-08-01T04:30:00Z')
  const end = new Date('2026-08-01T05:00:00Z')
  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  })
  expect(formatNativeSlot(start.toISOString(), end.toISOString(), 'Asia/Kolkata'))
    .toBe(`${formatter.format(start)} – ${formatter.format(end)} (Asia/Kolkata)`)
})
```

Add a calendar URL test with a non-UTC display timezone and assert canonical
UTC `dates` plus the encoded `ctz`.

- [ ] **Step 2: Run under `en-IN` and confirm the calendar test fails**

Run:

```bash
LANG=en_IN.UTF-8 LC_ALL=en_IN.UTF-8 npm test -- features/native-scheduling/presentation.test.ts
```

Expected: the new non-UTC calendar assertion fails because the existing code
converts into wall-clock parts and appends `Z`.

- [ ] **Step 3: Implement canonical UTC timestamp serialization**

Validate the date and return:

```ts
date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
```

Remove the fixed `en-US` formatter entirely. Continue sending `ctz` separately.

- [ ] **Step 4: Run locale matrix**

Run:

```bash
LANG=en_IN.UTF-8 LC_ALL=en_IN.UTF-8 npm test -- features/native-scheduling/presentation.test.ts
LANG=ar_EG.UTF-8 LC_ALL=ar_EG.UTF-8 npm test -- features/native-scheduling/presentation.test.ts
```

Expected: both runs pass with locale-appropriate visible dates and identical
calendar protocol values.

- [ ] **Step 5: Commit only after explicit user approval**

Suggested commit:

```bash
git add features/native-scheduling/presentation.ts features/native-scheduling/presentation.test.ts
git commit -m "fix(scheduling): make date formatting locale safe"
```

### Task 9: Cross-repo verification and deployment handoff

**Files:**
- Verify all modified files in `frontend/` and `service-apis/`.
- Update deployment configuration only with variable names, never values.

**Interfaces:**
- Verifies every prior task.

- [ ] **Step 1: Run service-api focused and full unit tests**

```bash
uv run pytest tests/workspace/test_notification.py tests/workspace/test_notification_read_state.py tests/workspace/test_notification_presentation.py tests/workspace/test_notification_worker.py tests/workspace/test_conversation_notifications.py tests/migrations/test_notification_read_migration.py -v
uv run pytest tests/ -m "not integration" -v
```

- [ ] **Step 2: Smoke service startup in delivery-disabled mode**

```bash
NOTIFICATION_EMAIL_DELIVERY_ENABLED=false uv run uvicorn proploy_service_apis.api.server:app --port 8020
```

Verify `/health` and `/ready`, then stop the server.

- [ ] **Step 3: Run frontend focused and full tests**

```bash
npm test -- features/workspace/workspace-notifications.test.tsx features/workspace/recent-activity.test.tsx features/workspace/proposal-detail.test.tsx components/ui/action-toast.test.tsx features/native-scheduling/presentation.test.ts
npm test
```

- [ ] **Step 4: Run frontend lint and production build**

```bash
npm run lint
npm run build
```

- [ ] **Step 5: Run Figma CSS hygiene scan**

```bash
rg -n "font-family\\\\/|font-weight\\\\/|'DM_Sans:|'Inter:|font-black" app components features hooks lib
```

Expected: zero new violations in touched files.

- [ ] **Step 6: Browser smoke the user flows**

Verify:

- selecting proposals never leaks previous edit data;
- accepting a proposal shows the bottom-center universal toast;
- Home Notifications opens the top modal without changing the URL;
- unread badges survive refresh;
- mark-one and mark-all persist;
- each notification and recent-activity row reaches its relevant page;
- realtime events appear without a full reload;
- no console errors or unexpected 4xx/5xx responses.

- [ ] **Step 7: Document deployment requirements**

Report required secret names and operational sequence:

1. apply Alembic revision 037;
2. verify the Resend sender domain;
3. set `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, and
   `NOTIFICATION_EMAIL_DELIVERY_ENABLED=true`;
4. deploy service-apis;
5. send one controlled recipient event;
6. confirm in-app persistence and a real Resend provider message ID;
7. deploy frontend.

- [ ] **Step 8: Present diffs and request commit approval**

Do not commit implementation changes until the user explicitly approves the
frontend and service-api commits.
