/**
 * Dev fixture for the workspace meetings calendar.
 *
 * The real feed is GET /api/v1/workspace/meetings (see features/workspace/use-meetings.ts).
 * Until that endpoint is live, the hook falls back to these fixtures in
 * development so the calendar renders fully populated. Force it on with
 * NEXT_PUBLIC_DASHBOARD_MOCK=1 (mirrors dashboard-mock.ts).
 *
 * Events are generated relative to *today* so the current month is always
 * populated regardless of the wall-clock date.
 */

import type { WorkspaceMeeting } from '@/features/workspace/types'

export const MEETINGS_MOCK_ENABLED =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_DASHBOARD_MOCK === '1'

/** Parties the signed-in workspace user has engagements with (client ↔ business). */
export interface MockParty {
  id: string
  name: string
}

export const MOCK_PARTIES: MockParty[] = [
  { id: 'eng-acme', name: 'Acme Corporation' },
  { id: 'eng-warpspeed', name: 'Warpspeed Labs' },
  { id: 'eng-boltshift', name: 'Boltshift' },
  { id: 'eng-sisyphus', name: 'Sisyphus Ventures' },
]

type Seed = {
  /** Day offset from the 1st of the current month. */
  day: number
  hour: number
  minute: number
  durationMin: number
  title: string
  party: string
  status: WorkspaceMeeting['status']
}

// A month's worth of calls spread across parties, times and statuses. Kept
// deterministic (no Math.random) so re-renders and tests are stable.
const SEEDS: Seed[] = [
  { day: 2, hour: 9, minute: 0, durationMin: 30, title: 'Weekly standup', party: 'Acme Corporation', status: 'scheduled' },
  { day: 2, hour: 11, minute: 30, durationMin: 45, title: 'Coffee with founder', party: 'Warpspeed Labs', status: 'scheduled' },
  { day: 3, hour: 10, minute: 30, durationMin: 30, title: 'Product demo', party: 'Boltshift', status: 'scheduled' },
  { day: 4, hour: 10, minute: 0, durationMin: 30, title: 'One-on-one', party: 'Sisyphus Ventures', status: 'scheduled' },
  { day: 4, hour: 16, minute: 0, durationMin: 60, title: 'All-hands sync', party: 'Acme Corporation', status: 'scheduled' },
  { day: 5, hour: 9, minute: 0, durationMin: 30, title: 'Friday standup', party: 'Warpspeed Labs', status: 'scheduled' },
  { day: 8, hour: 9, minute: 0, durationMin: 90, title: 'Deep work review', party: 'Boltshift', status: 'scheduled' },
  { day: 8, hour: 10, minute: 30, durationMin: 45, title: 'Design sync', party: 'Sisyphus Ventures', status: 'scheduled' },
  { day: 8, hour: 13, minute: 30, durationMin: 30, title: 'SEO planning', party: 'Acme Corporation', status: 'scheduled' },
  { day: 9, hour: 12, minute: 0, durationMin: 60, title: 'Lunch with team', party: 'Warpspeed Labs', status: 'completed' },
  { day: 10, hour: 10, minute: 0, durationMin: 30, title: 'Kickoff call', party: 'Boltshift', status: 'scheduled' },
  { day: 10, hour: 13, minute: 30, durationMin: 45, title: 'Product deep-dive', party: 'Sisyphus Ventures', status: 'scheduled' },
  { day: 11, hour: 11, minute: 0, durationMin: 30, title: 'Integrations review', party: 'Acme Corporation', status: 'scheduled' },
  { day: 15, hour: 9, minute: 30, durationMin: 30, title: 'Product planning', party: 'Warpspeed Labs', status: 'scheduled' },
  { day: 16, hour: 10, minute: 0, durationMin: 60, title: 'Contract review', party: 'Boltshift', status: 'scheduled' },
  { day: 17, hour: 9, minute: 30, durationMin: 30, title: 'Coffee with client', party: 'Sisyphus Ventures', status: 'scheduled' },
  { day: 17, hour: 14, minute: 30, durationMin: 45, title: 'Design feedback', party: 'Acme Corporation', status: 'scheduled' },
  { day: 21, hour: 11, minute: 30, durationMin: 30, title: 'Quarterly review', party: 'Warpspeed Labs', status: 'scheduled' },
  { day: 22, hour: 14, minute: 30, durationMin: 45, title: 'Design sync', party: 'Boltshift', status: 'scheduled' },
  { day: 23, hour: 10, minute: 0, durationMin: 30, title: 'Onboarding call', party: 'Sisyphus Ventures', status: 'scheduled' },
  { day: 24, hour: 13, minute: 45, durationMin: 60, title: 'Budget walkthrough', party: 'Acme Corporation', status: 'scheduled' },
  { day: 28, hour: 11, minute: 0, durationMin: 30, title: 'Content planning', party: 'Warpspeed Labs', status: 'scheduled' },
  { day: 6, hour: 15, minute: 0, durationMin: 30, title: 'Handover call', party: 'Boltshift', status: 'cancelled' },
]

function partyToEngagementId(name: string): string {
  const match = MOCK_PARTIES.find((p) => p.name === name)
  return match?.id ?? 'eng-unknown'
}

// ─── Day availability (for the interactive scheduler) ─────────────────────
// The Schedule-a-call planner shows the other party's calendar as busy blocks
// so the scheduler can find a slot that works for both. Until a real free/busy
// feed exists, we synthesize a deterministic day of busy blocks per party (and
// for the signed-in user) from a hash of (owner + date) — stable across
// re-renders, no Math.random.

export interface BusyBlock {
  /** Minutes from midnight — start of the busy interval. */
  startMin: number
  /** Minutes from midnight — end of the busy interval. */
  endMin: number
  label: string
  owner: 'you' | 'party'
}

function hashString(seed: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = (hash * 0x01000193) >>> 0
  }
  return hash >>> 0
}

function dateSeed(day: Date): string {
  return `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
}

const BUSY_TITLES = [
  'Internal sync',
  'Focus block',
  'Standup',
  '1:1',
  'Interview',
  'Planning',
  'Review',
  'Lunch',
]

const WINDOW_START_MIN = 8 * 60 // 8:00
const WINDOW_END_MIN = 19 * 60 // 19:00

/**
 * Deterministic busy blocks for one owner on one day, within business hours.
 * Blocks never overlap each other and are snapped to 15-minute increments.
 */
function seededBusyBlocks(seed: string, owner: 'you' | 'party'): BusyBlock[] {
  let h = hashString(seed)
  const next = () => {
    h = (h * 1103515245 + 12345) >>> 0
    return h
  }

  const blocks: BusyBlock[] = []
  // Start the day somewhere in the first hour of the window.
  let cursor = WINDOW_START_MIN + (next() % 4) * 15
  const count = 3 + (next() % 3) // 3–5 blocks

  for (let i = 0; i < count; i += 1) {
    const gap = 30 + (next() % 6) * 15 // 30–105 min gap before this block
    cursor += gap
    const dur = 30 + (next() % 5) * 15 // 30–90 min duration
    if (cursor + dur > WINDOW_END_MIN) break
    blocks.push({
      startMin: cursor,
      endMin: cursor + dur,
      label: BUSY_TITLES[next() % BUSY_TITLES.length],
      owner,
    })
    cursor += dur
  }
  return blocks
}

/**
 * Combined busy blocks for the signed-in user ("you") and the given party on a
 * specific day. Returns [] for the party side when no party is selected yet.
 */
export function buildDayAvailability(partyId: string | null, day: Date): BusyBlock[] {
  const you = seededBusyBlocks(`you-${dateSeed(day)}`, 'you')
  const party = partyId ? seededBusyBlocks(`${partyId}-${dateSeed(day)}`, 'party') : []
  return [...you, ...party]
}

/**
 * Build a month of fixture meetings anchored to the given reference date's
 * month. Only meetings whose start falls within [from, to] are returned.
 */
export function buildMockMeetings(reference: Date, from?: Date, to?: Date): WorkspaceMeeting[] {
  const year = reference.getFullYear()
  const month = reference.getMonth()

  const meetings = SEEDS.map((seed, index): WorkspaceMeeting => {
    const start = new Date(year, month, seed.day, seed.hour, seed.minute, 0, 0)
    const end = new Date(start.getTime() + seed.durationMin * 60_000)
    return {
      id: `mock-meeting-${index + 1}`,
      engagementId: partyToEngagementId(seed.party),
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      status: seed.status,
      title: `${seed.title} · ${seed.party}`,
      provider: 'cal_diy',
      meetingUrl: `https://cal.proploy.dev/meet/mock-${index + 1}`,
      locationUrl: null,
      timezone: 'UTC',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })

  if (!from && !to) return meetings
  const fromMs = from ? from.getTime() : -Infinity
  const toMs = to ? to.getTime() : Infinity
  return meetings.filter((m) => {
    if (!m.startsAt) return false
    const t = new Date(m.startsAt).getTime()
    return t >= fromMs && t <= toMs
  })
}
